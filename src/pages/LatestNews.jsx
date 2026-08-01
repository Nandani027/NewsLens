import { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import CategoryPills from "../components/CategoryPills/CategoryPills";
import NewsCard from "../components/NewsCard/NewsCard";
import "./LatestNews.css";

const LatestNews = () => {
  const [category, setCategory] = useState("technology");

  // Dummy data (replace with API later)
  const articles = [
    {
      id: 1,
      image: "https://picsum.photos/400/250?1",
      title: "Apple unveils new AI-powered iPhone features",
      description:
        "Apple introduced a range of AI-powered features during its latest event.",
      source: "BBC News",
      publishedAt: "2 hours ago",
      url: "https://www.bbc.com",
    },
    {
      id: 2,
      image: "https://picsum.photos/400/250?2",
      title: "NASA prepares for new Moon mission",
      description:
        "NASA announced preparations for its next lunar mission.",
      source: "Reuters",
      publishedAt: "3 hours ago",
      url: "https://www.reuters.com",
    },
    {
      id: 3,
      image: "https://picsum.photos/400/250?3",
      title: "Google launches new AI search features",
      description:
        "Google revealed powerful AI capabilities for Search.",
      source: "The Verge",
      publishedAt: "5 hours ago",
      url: "https://www.theverge.com",
    },
    {
      id: 4,
      image: "https://picsum.photos/400/250?4",
      title: "India wins thrilling cricket match",
      description:
        "India secured a dramatic victory in the final overs.",
      source: "ESPN Cricinfo",
      publishedAt: "1 hour ago",
      url: "https://www.espncricinfo.com",
    },
    {
      id: 5,
      image: "https://picsum.photos/400/250?5",
      title: "Scientists discover new exoplanet",
      description:
        "Researchers have identified an Earth-like planet outside our solar system.",
      source: "CNN",
      publishedAt: "6 hours ago",
      url: "https://www.cnn.com",
    },
    {
      id: 6,
      image: "https://picsum.photos/400/250?6",
      title: "Electric vehicle sales continue to rise",
      description:
        "Global EV sales have reached a new record this year.",
      source: "Bloomberg",
      publishedAt: "8 hours ago",
      url: "https://www.bloomberg.com",
    },
    {
      id: 7,
      image: "https://picsum.photos/400/250?5",
      title: "Scientists discover new exoplanet",
      description:
        "Researchers have identified an Earth-like planet outside our solar system.",
      source: "CNN",
      publishedAt: "6 hours ago",
      url: "https://www.cnn.com",
    },
    {
      id: 8,
      image: "https://picsum.photos/400/250?5",
      title: "Scientists discover new exoplanet",
      description:
        "Researchers have identified an Earth-like planet outside our solar system.",
      source: "CNN",
      publishedAt: "6 hours ago",
      url: "https://www.cnn.com",
    },
  ];

  const handleVerify = (article) => {
    console.log("Verify:", article.title);

    // Later:
    // navigate("/verify", {
    //   state: { news: article.url }
    // });
  };

  return (
    <>

      <section className="latest-news-page">


        <CategoryPills
          category={category}
          setCategory={setCategory}
        />

        <div className="news-grid">
          {articles.map((article) => (
            <NewsCard
              key={article.id}
              image={article.image}
              title={article.title}
              description={article.description}
              source={article.source}
              publishedAt={article.publishedAt}
              url={article.url}
              onVerify={() => handleVerify(article)}
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default LatestNews;