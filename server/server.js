const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();

const PORT = 5000;

// Middleware to share data to react
app.use(express.json());

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

    const searchQuery = articleTitle
    .replace(/[^a-zA-Z ]/g," ")
    .split(" ")
    .slice(0,5)
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



    // Send everything to frontend
    return res.json({

        success:true,

        type:"url",

        title:articleTitle,

        searchQuery:searchQuery,

        matchingArticles:matchingArticles,

        content:article

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


        return res.json({
            success:true,
            type:"headline",
            totalResults:newsResponse.data.totalResults,
            articles:newsResponse.data.articles
        });



    } 
}catch(error){

        res.status(500).json({
            success:false,
            message:"Verification failed",
            error:error.message
        });

    }

});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});