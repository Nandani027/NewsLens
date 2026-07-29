import "./MatchingArticles.css";


const MatchingArticles = ({result}) => {
  if (!result) return null;

   const articles = result.matchingArticles;

if (!articles) return null;

if (articles.length === 0) {
  return (
    <section className="matching-section">
      <h2 className="section-title">Matching Articles</h2>
      <p>No matching articles found.</p>
    </section>
  );
}

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
  {new Date(article.publishedAt).toLocaleDateString()}
</span>
            </div>

            <h3>{article.title}</h3>

            <p>{article.url}</p>

            <button
  className="read-btn"
  onClick={() => window.open(article.url, "_blank")}
>
  Read Article →
</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MatchingArticles;