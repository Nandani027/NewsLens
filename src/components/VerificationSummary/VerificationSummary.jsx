import "./VerificationSummary.css";
import { FiCheckCircle } from "react-icons/fi";

const VerificationSummary = () => {
  return (
    <section className="summary-section">
      <h2 className="section-title">Verification Summary</h2>

      <div className="summary-card">
        <div className="summary-item">
          <FiCheckCircle className="summary-icon" />
          <span>Multiple trusted news sources found.</span>
        </div>

        <div className="summary-item">
          <FiCheckCircle className="summary-icon" />
          <span>Headlines are highly consistent.</span>
        </div>

        <div className="summary-item">
          <FiCheckCircle className="summary-icon" />
          <span>Publication dates are closely aligned.</span>
        </div>

        <div className="summary-item">
          <FiCheckCircle className="summary-icon" />
          <span>No major fact-check warnings detected.</span>
        </div>
      </div>
    </section>
  );
};

export default VerificationSummary;