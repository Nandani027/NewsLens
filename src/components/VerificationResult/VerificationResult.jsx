import "./VerificationResult.css";

const VerificationResult = () => {
  return (
    <section className="verification-section">

      <h2 className="verification-heading">
        Verification Result
      </h2>

      <div className="result-card">

        <div className="confidence-circle">
          <span className="score">91%</span>
          <p>Confidence</p>
        </div>

        <div className="result-content">

          <span className="status-badge">
            ✓ LIKELY AUTHENTIC
          </span>

          <h3>Strong Source Match</h3>

          <p>
            This story is corroborated by multiple trusted,
            independent publishers with no significant
            discrepancies.
          </p>

        </div>

      </div>

    </section>
  );
};

export default VerificationResult;