import "./VerificationSummary.css";
import { FiCheckCircle } from "react-icons/fi";

const VerificationSummary = ({ result }) => {
  if (!result) return null;

  const summary = result.analysis?.verificationSummary;

  if (!summary) return null;

  return (
    <section className="summary-section">

      <div className="summary-card">

        <div className="card-header">
          <h2>Verification Summary</h2>
        </div>

        <div className="card-body">
          {summary.map((item, index) => (
            <div className="summary-item" key={index}>
              <FiCheckCircle className="summary-icon" />
              <span>{item}</span>
            </div>
          ))}
        </div>

      </div>

    </section>
  );
};

export default VerificationSummary;