import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar/Navbar";
import CategoryPills from "../components/CategoryPills/CategoryPills";
import NewsCard from "../components/NewsCard/NewsCard";
import "./LatestNews.css";

const LatestNews = () => {
  const [category, setCategory] = useState("technology");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLatestNews();
  }, [category]);

  const fetchLatestNews = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:5000/latest-news",
        {
          params: {
            category,
          },
        }
      );


      setArticles(response.data.articles);
    } catch (error) {
      console.error("Failed to fetch latest news:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const navigate = useNavigate();

  const handleVerify = (article) => {
    console.log("Verify:", article);
    navigate("/verify-news", {
      state: {
        news: article.url,
      },
    });
  };

  return (
    <>

      <section className="latest-news-page">

        <CategoryPills
          category={category}
          setCategory={setCategory}
        />

        {loading ? (
          <h2 className="loading-text">Loading latest news...</h2>
        ) : (
          <div className="news-grid">
            {articles.map((article, index) => (
              <NewsCard
                key={article.url || index}
                image={article.urlToImage}
                title={article.title}
                description={article.description}
                source={article.source.name}
                publishedAt={new Date(
                  article.publishedAt
                ).toLocaleDateString()}
                url={article.url}
                onVerify={() => handleVerify(article)}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default LatestNews;