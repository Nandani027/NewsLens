import "./VerificationResult.css";

const VerificationResult = ({result}) => {
  if (!result) return null;
  const verification = result.analysis.verificationResult;

  if (!verification) return null;

  const verdict = verification.verdict;
  const confidence = verification.confidence;
  const summary = result.analysis?.verificationSummary;
  return (

    <section className="verification-section">

      <h2 className="verification-heading">
        Verification Result
      </h2>

      <div className="result-card">

        <div className="confidence-circle">
          <span className="score">{confidence}%</span>
          <p>Confidence</p>
        </div>

        <div className="result-content">

          <span className="status-badge">
            ✓ {verdict.toUpperCase()}
          </span>

          <h3>{verdict}</h3>
          <p>
  {summary?.[0]}
</p>
        </div>

      </div>

    </section>
  );
};

export default VerificationResult;