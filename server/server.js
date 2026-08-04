const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Priority list of models to rotate through in case of rate limits or model unavailability.
 */
const MODEL_FALLBACK_LIST = [
  "gemini-3.6-flash",       
  "gemini-3.5-flash",       
  "gemini-3.5-flash-lite",  
  "gemini-3.1-flash-lite"   
];

/**
 * Helper function to handle transient Gemini 503/429 errors with dynamic backoff and multi-model fallback.
 */
async function callGeminiWithFallbackAndRetry(
  prompt,
  schemaConfig,
  retriesPerModel = 2,
  initialDelay = 1500
) {
  let lastError = null;

  // 1. Iterate through candidate models
  for (const modelName of MODEL_FALLBACK_LIST) {
    let currentDelay = initialDelay;

    // 2. Retry loop for transient issues per model
    for (let attempt = 0; attempt <= retriesPerModel; attempt++) {
      try {
        console.log(
          `[Gemini Execution] Attempting generation with model: ${modelName}`
        );

        return await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: schemaConfig,
        });
      } catch (error) {
        lastError = error;
        let parsedError = error;

        // Extract nested stringified JSON errors if present
        if (typeof error?.message === "string" && error.message.includes("{")) {
          try {
            parsedError = JSON.parse(error.message);
          } catch (e) {
            // Fallback if parsing fails
          }
        }

        const errorCode =
          error?.status || error?.code || parsedError?.error?.code;
        const errorStatusStr = parsedError?.error?.status || "";
        const errorMessage =
          error?.message || parsedError?.error?.message || "";

        const isQuotaExhausted =
          errorCode === 429 ||
          errorStatusStr === "RESOURCE_EXHAUSTED" ||
          errorMessage.includes("Quota exceeded") ||
          errorMessage.includes("limit: 0");

        const isTransientError =
          errorCode === 503 ||
          errorStatusStr === "UNAVAILABLE" ||
          errorMessage.includes("high demand") ||
          errorMessage.includes("503");

        // Case A: Hard rate limit / quota exhausted -> Break retries for THIS model and jump to next fallback model
        if (isQuotaExhausted) {
          console.warn(
            `Model '${modelName}' quota exhausted (${errorMessage}). Attempting fallback to next model...`
          );
          break;
        }

        // Case B: Transient server issue -> Retry same model with exponential backoff
        if (isTransientError && attempt < retriesPerModel) {
          console.warn(
            `Model '${modelName}' busy (${errorCode || "503"}). Retrying in ${currentDelay}ms... (${retriesPerModel - attempt} retries left)`
          );
          await new Promise((resolve) => setTimeout(resolve, currentDelay));
          currentDelay *= 2;
          continue;
        }

        // Case C: Non-retriable structural/prompt error -> Throw immediately without burning all models
        console.error(`Unhandled API Error on model '${modelName}':`, errorMessage);
        throw error;
      }
    }
  }

  // If every single model in the fallback array failed due to 429/503
  const customErr = new Error(
    "All available AI models are currently busy or rate limited. Please try again in 30 seconds."
  );
  customErr.status = 429;
  throw customErr;
}

function extractArticleTitle(articleText) {
  if (!articleText || typeof articleText !== "string") return "";

  const lines = articleText
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) return "";

  const titleLine = lines.find((line) =>
    line.toLowerCase().startsWith("title:")
  );
  if (titleLine) {
    return titleLine.replace(/^title:/i, "").trim();
  }

  const headingLine = lines.find((line) => line.startsWith("#"));
  if (headingLine) {
    return headingLine.replace(/^#+\s*/, "").trim();
  }

  return lines[0];
}

function generateOptimizedQuery(text) {
  if (!text) return "";

  const stopWords = new Set([
    "a", "about", "above", "after", "again", "all", "an", "and", "any", "are",
    "as", "at", "be", "because", "been", "before", "being", "below", "between",
    "both", "but", "by", "could", "did", "do", "does", "doing", "down", "during",
    "each", "few", "for", "from", "further", "had", "has", "have", "having",
    "he", "her", "here", "him", "his", "how", "i", "if", "in", "into", "is",
    "it", "its", "me", "more", "most", "my", "no", "nor", "not", "of", "off",
    "on", "once", "only", "or", "other", "our", "out", "over", "own", "same",
    "she", "should", "so", "some", "such", "than", "that", "the", "their",
    "them", "then", "there", "these", "they", "this", "those", "through",
    "to", "too", "under", "until", "up", "very", "was", "we", "were", "what",
    "when", "where", "which", "while", "who", "whom", "why", "with", "would",
    "you", "your", "signals", "beginning", "end"
  ]);

  const words = text
    .replace(/[:’'”"-]/g, " ")
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word.toLowerCase()));

  const keyWords = Array.from(new Set(words));
  return keyWords.slice(0, 5).join(" ");
}

// Latest News Route
app.get("/latest-news", async (req, res) => {
  try {
    const category = req.query.category || "technology";

    const response = await axios.get("https://newsapi.org/v2/everything", {
      params: {
        q: category,
        language: "en",
        sortBy: "publishedAt",
        pageSize: 35,
        apiKey: process.env.NEWS_API_KEY,
      },
    });

    res.json({
      success: true,
      articles: response.data.articles.slice(0, 32),
    });
  } catch (error) {
    console.error("NewsAPI Error:", error?.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "Unable to fetch latest news",
    });
  }
});

// Home Route
app.get("/", (req, res) => {
  res.send("NewsLens Backend is Running!");
});

// Verify Route
app.post("/verify", async (req, res) => {
  console.log("VERIFY ROUTE HIT");

  const { input } = req.body;
  console.log("Received:", input);

  if (!input) {
    return res.status(400).json({
      success: false,
      message: "Please enter a news headline or article URL.",
    });
  }

  const isURL = /^https?:\/\/.+/i.test(input);

  try {
    let articleTitle = "";
    let articleContent = "";
    let matchingArticles = [];
    let prompt = "";
    let responseType = "headline";

    if (isURL) {
      responseType = "url";

      // Extract article using Jina
      const jinaUrl = `https://r.jina.ai/${input}`;
      const jinaResponse = await axios.get(jinaUrl);
      articleContent = jinaResponse.data;

      articleTitle = extractArticleTitle(articleContent);
      console.log("Article Title:", articleTitle);

      if (!articleTitle) {
        return res.json({
          success: true,
          type: "url",
          title: "",
          content: articleContent,
          matchingArticles: [],
        });
      }

      // Generate optimized search query
      const searchQuery = generateOptimizedQuery(articleTitle);
      console.log("Search Query (URL):", searchQuery);

      // Search similar articles using NewsAPI
      const matchResponse = await axios.get("https://newsapi.org/v2/everything", {
        params: {
          q: searchQuery,
          language: "en",
          pageSize: 5,
          sortBy: "relevancy",
          apiKey: process.env.NEWS_API_KEY,
        },
      });

      matchingArticles = matchResponse.data.articles.map((art) => ({
        title: art.title,
        source: art.source.name,
        url: art.url,
        publishedAt: art.publishedAt,
      }));

      prompt = `
You are an AI fact-checking assistant for NewsLens.

Your task is to verify whether an original news article is supported by reliable reporting and assess its overall credibility based on matching sources and internal content analysis.

ORIGINAL ARTICLE
Title: ${articleTitle}
Content: ${articleContent.substring(0, 4000)}

--------------------------------------------------

MATCHING ARTICLES
${
  matchingArticles.length > 0
    ? matchingArticles
        .map(
          (art, index) => `
Article ${index + 1}
Title: ${art.title}
Source: ${art.source}
Published: ${art.publishedAt}
`
        )
        .join("\n")
    : "No matching articles provided."
}

--------------------------------------------------

INSTRUCTIONS & VERDICT RULES:

1. Verdict Categories & Confidence Guidelines:
   - "Likely Authentic": MUST assign confidence between 80 and 100 (Multiple trusted matching articles directly confirm the core event and claim).
   - "Misleading": MUST assign confidence between 40 and 70 ONLY (Headline exaggerates facts, takes statements out of context, or uses clickbait tactics not fully supported by the articles).
   - "Likely Fake": MUST assign confidence between 70 and 100. (High confidence that the claim in the headline is false or explicitly refuted by reliable reporting).
   - "Insufficient Evidence": MUST assign confidence between 10 and 40. (Few or no matching articles are provided to verify the claim).
   CRITICAL RULE: Your numerical confidence score MUST strictly lie within the exact range assigned to the chosen verdict category. Do NOT assign a score outside the category's range!

2. SPECIAL RULE FOR NO MATCHING ARTICLES:
   If no matching articles are provided, the verdict MUST remain "Insufficient Evidence", but DO NOT give a score of 0.
   Evaluate the ORIGINAL ARTICLE on its internal merits and assign a score between 10 and 35 based on:
   - Professional & objective tone vs. emotional, aggressive, or clickbait language.
   - Specificity (presence of named officials, organizations, dates) vs. vague claims ("sources say", "experts claim").
   - Internal logical consistency and absence of obvious conspiracy tropes or contradictions.

3. Verification Summary Rules:
   - "verificationSummary" MUST be an array containing EXACTLY four short sentences.
   - Do NOT include bullet points, dashes, or special list characters (e.g., •, -, *).
   - If no matching articles exist, state that external cross-verification was unavailable, then summarize the article's internal credibility signals (tone, specificity, structure).

4. Supporting Sources Rules:
   - "supportingTrustedSources" MUST ONLY list unique sources present in the MATCHING ARTICLES section above.
   - If no matching articles exist, return an empty array [].

5. Output Constraints:
   - Output MUST be strictly raw, valid JSON.
   - Do NOT include markdown code blocks (e.g., \`\`\`json or \`\`\`).
   - Do NOT output any introductory text, trailing text, or explanatory prose outside the JSON object.

REQUIRED JSON FORMAT:
{
  "verificationResult": {
    "verdict": "Likely Authentic | Misleading | Likely Fake | Insufficient Evidence",
    "confidence": <integer matching the chosen verdict range above>
  },
  "verificationSummary": [
    "First sentence stating external verification was unavailable.",
    "Second sentence evaluating the original article's tone and writing quality.",
    "Third sentence noting the presence or absence of specific internal citations.",
    "Fourth sentence summarizing the overall internal plausibility assessment."
  ],
  "supportingTrustedSources": []
}
`;
    } else {
      responseType = "headline";

      const searchQuery = generateOptimizedQuery(input);
      console.log("Search Query (Headline):", searchQuery);

      const newsResponse = await axios.get("https://newsapi.org/v2/everything", {
        params: {
          q: searchQuery || input,
          language: "en",
          pageSize: 5,
          sortBy: "relevancy",
          apiKey: process.env.NEWS_API_KEY,
        },
      });

      matchingArticles = newsResponse.data.articles.map((art) => ({
        title: art.title,
        source: art.source.name,
        url: art.url,
        publishedAt: art.publishedAt,
      }));

      prompt = `
You are an AI fact-checking assistant for NewsLens.

Your task is to verify whether the provided news headline is supported by reliable reporting and assess its credibility based on the provided matching articles.

HEADLINE TO VERIFY
"${input}"

--------------------------------------------------

MATCHING ARTICLES
${
  matchingArticles.length > 0
    ? matchingArticles
        .map(
          (art, index) => `
Article ${index + 1}
Title: ${art.title}
Source: ${art.source}
Published: ${art.publishedAt}
`
        )
        .join("\n")
    : "No matching articles provided."
}

--------------------------------------------------

INSTRUCTIONS & VERDICT RULES:

1. Verdict Categories & Confidence Guidelines:
   - "Likely Authentic": MUST assign confidence between 80 and 100 (Multiple trusted matching articles directly confirm the core event and claim).
   - "Misleading": MUST assign confidence between 40 and 70 ONLY (Headline exaggerates facts, takes statements out of context, or uses clickbait tactics not fully supported by the articles).
   - "Likely Fake": MUST assign confidence between 70 and 100. (High confidence that the claim in the headline is false or explicitly refuted by reliable reporting).
   - "Insufficient Evidence": MUST assign confidence between 10 and 40. (Few or no matching articles are provided to verify the claim).
   CRITICAL RULE: Your numerical confidence score MUST strictly lie within the exact range assigned to the chosen verdict category. Do NOT assign a score outside the category's range!

2. SPECIAL RULE FOR NO MATCHING ARTICLES:
   If no matching articles are provided, the verdict MUST be "Insufficient Evidence".
   Do NOT assign a score of 0. Evaluate the HEADLINE on its structure and assign a score between 10 and 35 based on:
   - Sensationalism & emotional manipulation vs. objective journalistic phrasing.
   - Specificity (names of people, places, organizations) vs. vague assertions ("You won't believe what happened").

3. Verification Summary Rules:
   - "verificationSummary" MUST be an array containing EXACTLY four short sentences.
   - Do NOT include bullet points, dashes, or special list symbols (e.g., •, -, *).
   - If matching articles are missing, state that external confirmation is unavailable, then briefly summarize the headline's internal phrasing signals.

4. Supporting Sources Rules:
   - "supportingTrustedSources" MUST ONLY list unique source names present in the MATCHING ARTICLES section above.
   - Do NOT invent or hallucinate sources. Return an empty array [] if no matching articles exist.

5. Output Constraints:
   - Output MUST be strictly raw, valid JSON.
   - Do NOT wrap the output in markdown blocks (e.g., \`\`\`json or \`\`\`).
   - Do NOT write any introductory or extra text outside the JSON object.

REQUIRED JSON FORMAT:
{
  "verificationResult": {
    "verdict": "Likely Authentic | Misleading | Likely Fake | Insufficient Evidence",
    "confidence": <integer matching the chosen verdict range above>
  },
  "verificationSummary": [
    "First sentence stating whether the headline is supported by external reporting.",
    "Second sentence describing the central claim extracted from the headline.",
    "Third sentence detailing evidence from matching sources or structural analysis.",
    "Fourth sentence providing the final conclusion on credibility."
  ],
  "supportingTrustedSources": []
}
`;
    }

    // Shared schema configuration for dynamic model invocation
    const schemaConfig = {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          verificationResult: {
            type: "OBJECT",
            properties: {
              verdict: {
                type: "STRING",
                enum: [
                  "Likely Authentic",
                  "Misleading",
                  "Likely Fake",
                  "Insufficient Evidence",
                ],
              },
              confidence: { type: "INTEGER" },
            },
            required: ["verdict", "confidence"],
          },
          verificationSummary: {
            type: "ARRAY",
            items: { type: "STRING" },
          },
          supportingTrustedSources: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                name: { type: "STRING" },
              },
            },
          },
        },
        required: [
          "verificationResult",
          "verificationSummary",
          "supportingTrustedSources",
        ],
      },
    };

    // Call Gemini using dynamic model fallback and retry logic
    const response = await callGeminiWithFallbackAndRetry(prompt, schemaConfig);

    const aiText = response.text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let analysis;
    try {
      analysis = JSON.parse(aiText);
    } catch (err) {
      console.error("Gemini returned invalid JSON:", aiText);
      return res.status(500).json({
        success: false,
        message: "Failed to parse AI response.",
      });
    }

    return res.json({
      success: true,
      type: responseType,
      headline: responseType === "headline" ? input : undefined,
      originalTitle: responseType === "url" ? articleTitle : undefined,
      content: responseType === "url" ? articleContent : undefined,
      matchingArticles,
      analysis,
    });
  } catch (error) {
    console.error(
      "Backend Server Error:",
      error?.response?.data || error.message
    );

    const statusCode = error?.status || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Verification failed",
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});