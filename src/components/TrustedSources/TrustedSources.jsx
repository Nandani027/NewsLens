import "./TrustedSources.css";

const sources = [
  "Reuters",
  "BBC",
  "Associated Press",
  "The Hindu",
  "NDTV",
  "CNN",
  "Al Jazeera",
  "The Guardian",
  "Times of India",
  "Hindustan Times",
];

const TrustedSources = () => {
  return (
    <section className="sources-section">
      <h2 className="section-title">Supporting Trusted Sources</h2>

      <div className="sources-container">
        {sources.map((source, index) => (
          <div className="source-pill" key={index}>
            {source}
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustedSources;