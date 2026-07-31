import "./TrustedSources.css";

const TrustedSources = ({ result }) => {
  if (!result) return null;

  const sources = result.analysis?.supportingTrustedSources;

  if (!sources) return null;

  return (
    <section className="sources-section">

      <div className="sources-card">

        <div className="card-header">
          <h2>Trusted Sources</h2>
        </div>

        <div className="card-body">

          {sources.length === 0 ? (
            <p className="no-sources">
              No trusted sources were found.
            </p>
          ) : (
            <div className="sources-container">
              {sources.map((source, index) => (
                <div className="source-pill" key={index}>
                  {source.name}
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

    </section>
  );
};

export default TrustedSources;