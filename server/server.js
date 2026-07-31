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
            success:false,
            message:"Please enter a news headline or article URL."
        });
    }


    const isURL = /^https?:\/\/.+/i.test(input);


    try {

        // URL INPUT
if (isURL) {

    // 1. Extract article using Jina
    const jinaUrl = `https://r.jina.ai/${input}`;

    const jinaResponse = await axios.get(jinaUrl);

    const article = jinaResponse.data;


    // Extract title
    const lines = article.split("\n");

    let articleTitle = "";

    const titleLine = lines.find(line =>
        line.toLowerCase().startsWith("title:")
    );

    if(titleLine){
        articleTitle = titleLine.replace(/title:/i,"").trim();
    }
    else{
        const heading = lines.find(line =>
            line.startsWith("#")
        );

        articleTitle = heading
        ? heading.replace("#","").trim()
        : "";
    }


    console.log("Article Title:", articleTitle);

    const stopWords = [
    "the",
    "a",
    "an",
    "is",
    "are",
    "of",
    "to",
    "in",
    "on",
    "for",
    "and",
    "with"
];

    const searchQuery = articleTitle
    .toLowerCase()
    .replace(/[^a-zA-Z ]/g, "")
    .split(" ")
    .filter(word => word && !stopWords.includes(word))
    .slice(0,10)
    .join(" ");

    if(!articleTitle){
    return res.json({
        success:true,
        type:"url",
        title:"",
        content:article,
        matchingArticles:[]
    });
}



    // Search similar articles using NewsAPI
    const matchResponse = await axios.get(
        "https://newsapi.org/v2/everything",
        {   
            
            params:{
                q:searchQuery,
                language:"en",
                pageSize:5,
                sortBy:"relevancy",
                apiKey:process.env.NEWS_API_KEY
            }
        }
    );

    console.log("NewsAPI results:", matchResponse.data.totalResults);


    const matchingArticles = matchResponse.data.articles.map(article=>({
        title:article.title,
        source:article.source.name,
        url:article.url,
        publishedAt:article.publishedAt
    }));

    if (matchingArticles.length === 0) {
    return res.json({
        success: true,
        type: "url",
        originalTitle: articleTitle,
        matchingArticles: [],
        analysis: {
            verificationResult: {
                verdict: "Insufficient Evidence",
                confidence: 0
            },
            verificationSummary: [
                "No matching trusted news articles were found.",
                "The article could not be independently verified.",
                "More evidence is required before determining credibility.",
                "Try verifying again later or use another source."
            ],
            supportingTrustedSources: []
        }
    });
}
  
    //gemini prompt

    const url_prompt = `
    You are an AI fact-checking assistant for NewsLens.

    Your task is to verify whether a news article is supported by reliable reporting and assess the credibility of the news.

    ORIGINAL ARTICLE

   Title:${articleTitle}

   Content:${article.substring(0, 4000)}

--------------------------------------------------

MATCHING ARTICLES

${matchingArticles.map((article, index) => `
Article ${index + 1}
Title: ${article.title}
Source: ${article.source}
Published: ${article.publishedAt}
`).join("\n")}

--------------------------------------------------

Instructions:

1. Compare the original article with the matching articles.

2. Determine whether the original article is:
- Likely Authentic
- Misleading
- Likely Fake
- Insufficient Evidence

3. Consider:
- Whether multiple trusted sources report the same event.
- Whether the headline matches the reported facts.
- Whether there are major contradictions.
- Whether the claims appear exaggerated or unsupported.

4. Give a confidence score according to these guidelines:

- Likely Authentic: 80–100
- Misleading: 40–70
- Likely Fake: 70–100 (confidence that the claim is false)
- Insufficient Evidence: 0–40

If there is not enough reliable evidence, the confidence score should never exceed 40.

5. Return verificationSummary as an array containing EXACTLY four short sentences.
Do not include bullet symbols such as •, -, or *.

List ONLY supporting sources from the MATCHING ARTICLES provided above.

Treat the ORIGINAL ARTICLE as the article being verified.
Treat the MATCHING ARTICLES as supporting evidence.
Base your verdict on how well the supporting evidence confirms or contradicts the original article.

Do not invent or generate any source that is not present in the supplied articles.

Return ONLY valid JSON.

{
  "verificationResult": {
    "verdict": "Likely Authentic",
    "confidence": 91
  },
  "verificationSummary": [
    "Sentence 1",
    "Sentence 2",
    "Sentence 3",
    "Sentence 4"
  ],
  "supportingTrustedSources": [
    {
      "name": "Reuters",

    },
    {
      "name": "BBC",
      
    }
  ]
}

Do not include markdown.
Do not wrap the JSON inside \`\`\`.
Do not write any additional text.
`;
   const response = await ai.models.generateContent({
  model: "gemini-3.1-flash-lite",
  contents: url_prompt,
   });


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
        message: "Failed to parse AI response."
    });
}

    // Sending to frontend
   return res.json({
  success: true,
  type: "url",
  originalTitle: articleTitle,
  content: article,
  matchingArticles,
  analysis,
});

}
else{
        // HEADLINE INPUT
        const newsResponse = await axios.get(
            "https://newsapi.org/v2/everything",
            {
                params:{
                    q:input,
                    language:"en",
                    pageSize:5,
                    sortBy:"relevancy",
                    apiKey:process.env.NEWS_API_KEY
                }
            }
        );

        const matchingArticles = newsResponse.data.articles.map(article => ({
    title: article.title,
    source: article.source.name,
    url: article.url,
    publishedAt: article.publishedAt
}));
        if (matchingArticles.length === 0) {
    return res.json({
        success: true,
        type: "headline",
        matchingArticles: [],
        analysis: {
            verificationResult: {
                verdict: "Insufficient Evidence",
                confidence: 0
            },
            verificationSummary: [
                "No matching trusted news articles were found.",
                "The article could not be independently verified.",
                "More evidence is required before determining credibility.",
                "Try verifying again later or use another source."
            ],
            supportingTrustedSources: []
        }
    });
}

        const headlinePrompt = `
You are an AI fact-checking assistant for NewsLens.

Your task is to determine whether the following news headline is supported by reliable reporting.

HEADLINE

${input}

--------------------------------------------------

MATCHING ARTICLES

${matchingArticles.map((article, index) => `
Article ${index + 1}
Title: ${article.title}
Source: ${article.source}
Published: ${article.publishedAt}
`).join("\n")}

--------------------------------------------------

Instructions:

1. Compare the given headline with the matching news articles.

2. Determine whether the headline is:
- Likely Authentic
- Misleading
- Likely Fake
- Insufficient Evidence

3. Check whether the trusted sources describe the same event.

4. If the headline appears exaggerated or unsupported by the available articles, explain why.

5. Give a confidence score according to these guidelines:

- Likely Authentic: 80–100
- Misleading: 40–70
- Likely Fake: 70–100 (confidence that the claim is false)
- Insufficient Evidence: 0–40

If there is not enough reliable evidence, the confidence score should never exceed 40.

6. Return verificationSummary as an array containing EXACTLY four short sentences.
Do not include bullet symbols such as •, -, or *.

7.List ONLY supporting sources from the MATCHING ARTICLES provided above.

Treat the HEADLINE as the claim being verified.
Use only the MATCHING ARTICLES as evidence.
Do not assume facts beyond the provided headline and matching articles.

Do not invent or generate any source that is not present in the supplied articles.


Return ONLY valid JSON in the following format:

{
  "verificationResult": {
    "verdict": "Likely Authentic",
    "confidence": 91
  },
  "verificationSummary": [
    "Sentence 1",
    "Sentence 2",
    "Sentence 3",
    "Sentence 4"
  ],
  "supportingTrustedSources": [
    {
      "name": "Reuters",
 
    },
    {
      "name": "BBC",
    
    }
  ]
}

Do not include markdown.
Do not wrap the JSON inside \`\`\`.
Do not write anything except the JSON.
`;
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: headlinePrompt,
});

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
        message: "Failed to parse AI response."
    });
}


   return res.json({
    success: true,
    type: "headline",
    headline: input,
    matchingArticles,
    analysis
});

    } 
}catch(error){

        console.error("Backend Server Error:", error?.response?.data || error.message);

    return res.status(500).json({
      success: false,
      message: "Verification failed",
      error: error.message,
    });

    }

});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});