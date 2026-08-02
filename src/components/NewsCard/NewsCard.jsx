import "./NewsCard.css";
import placeholder from "src/assets/latestnews.jpg";

const NewsCard = ({
  image,
  title,
  description,
  source,
  publishedAt,
  url,
  onVerify,
}) => {
  return (
    <div className="news-card">
      <img
        src={image || placeholder}
        alt={title}
        className="news-card-image"
         onError={(e) => {
    e.target.onerror = null; 
    e.target.src = placeholder;
  }}
      />

      <div className="news-card-content">
        <h3 className="news-card-title">
          {title}
        </h3>

        <p className="news-card-description">
          {description || "No description available."}
        </p>

        <div className="news-card-meta">
          <span>{source}</span>
          <span>{publishedAt}</span>
        </div>

        <div className="news-card-actions">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="read-more"
          >
            Read More →
          </a>

          <button
            className="verifynews-btn"
            onClick={onVerify}
          >
            Verify News
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;