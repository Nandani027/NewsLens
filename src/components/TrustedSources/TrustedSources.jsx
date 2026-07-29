import "./TrustedSources.css";

const TrustedSources = ({result}) => {
  if (!result) return null;

  const sources = result.analysis?.supportingTrustedSources;

if (!sources) return null;

if (sources.length === 0) {
  return (
    <section className="sources-section">
      <h2 className="section-title">Supporting Trusted Sources</h2>
      <div className="sources-container"><p>No trusted sources were found.</p></div>
    </section>
  );
}
  return (
    <section className="sources-section">
      <h2 className="section-title">Supporting Trusted Sources</h2>

      <div className="sources-container">
        {sources.map((source, index) => (
  <div className="source-pill" key={index}>
    {source.name}
  </div>
))}
        
      </div>
    </section>
  );
};

export default TrustedSources;