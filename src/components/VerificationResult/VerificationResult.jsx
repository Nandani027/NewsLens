import "./VerificationResult.css";
import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const VerificationResult = ({result}) => {
  if (!result) return null;
  const verification = result.analysis.verificationResult;

  if (!verification) return null;

  const verdict = verification.verdict;
  const confidence = verification.confidence;
  const summary = result.analysis?.verificationSummary;
  return (

   <section className="verification-section">

  <div className="result-card">

    <div className="result-header">
      <h2>Verification Result</h2>
    </div>

    <div className="result-body">

      <div className="confidence-wrapper">
        <div className="confidence-circle">
          <CircularProgressbar
            value={confidence}
            text={`${confidence}%`}
            strokeWidth={7}
            styles={buildStyles({
              pathColor: "#22a55a",
              trailColor: "#E5E5E5",
              textColor: "#111",
              textSize: "20px",
            })}
          />
        </div>

        <p className="confidence-label">Confidence</p>
      </div>

      <div className="result-content">

        <span className="status-badge">
          ✓ {verdict.toUpperCase()}
        </span>

        <h3 className="result-title">{verdict}</h3>

        <p className="result-description">
          {summary?.[0]}
        </p>

      </div>

    </div>

  </div>

</section>
  );
};

export default VerificationResult;