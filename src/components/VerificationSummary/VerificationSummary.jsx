import "./VerificationSummary.css";
import { FiCheckCircle } from "react-icons/fi";

const VerificationSummary = ({ result }) => {

  if (!result) return null;

  const summary = result.analysis?.verificationSummary;

  if (!summary) return null;

  return (
    <section className="summary-section">

      <h2 className="section-title">
        Verification Summary
      </h2>

      <div className="summary-card">
        {summary.map((item, index) => (
          <div className="summary-item" key={index}>
            <FiCheckCircle className="summary-icon" />
            <span>{item}</span>
          </div>
        ))}
      </div>

    </section>
  );
};

export default VerificationSummary;