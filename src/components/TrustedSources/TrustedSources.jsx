import "./TrustedSources.css";

const TrustedSources = ({ result }) => {
  if (!result) return null;

  const sources = result.analysis?.supportingTrustedSources;

  if (!sources) return null;

  if (sources.length === 0) {
    return (
      <section className="sources-section">
        <div className="sources-card">
          <div className="card-header">
            <h2>Trusted Sources</h2>
          </div>
          <div className="sources-container">
            <p>No trusted sources were found.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="sources-section">
      <div className="sources-card">
        <div className="card-header">
          <h2>Trusted Sources</h2>
        </div>

        <div className="sources-container">
          {sources.map((source, index) => (
            <div className="source-pill" key={source.id ?? index}>
              {source.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedSources;