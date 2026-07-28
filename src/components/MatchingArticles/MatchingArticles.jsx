import "./MatchingArticles.css";

const articles = [
  {
    source: "BBC News",
    title: "India wins ICC Champions Trophy after thrilling final.",
    url: "https://www.bbc.com/news",
    time: "2 hours ago",
  }]

const MatchingArticles = () => {
  return (
    <section className="matching-section">
      <h2 className="section-title">Matching Articles</h2>

      <div className="articles-container">
        {articles.map((article, index) => (
          <div className="article-card" key={index}>
            <div className="article-top">
              <span className="article-source">
                {article.source}
              </span>

              <span className="article-time">
                {article.time}
              </span>
            </div>

            <h3>{article.title}</h3>

            <p>{article.url}</p>

            <button className="read-btn">
              Read Article →
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MatchingArticles;