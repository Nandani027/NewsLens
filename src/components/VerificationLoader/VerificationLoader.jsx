import "./VerificationLoader.css";

const VerificationLoader = () => {
  return (
    <div className="loader-container">
      <div className="success-box">
        <div className="dot"></div>
        <div className="dot two"></div>

        <div className="face">
          <div className="eye"></div>
          <div className="eye right"></div>
          <div className="mouth happy"></div>
        </div>

        <div className="shadow"></div>

        <div className="message">
          <h1 className="alert">Fact-Check News</h1>
          <h2 className="quote">Verify Before You Believe</h2>
          <p>Compare your news with trusted sources and AI-powered analysis.</p>
        </div>

        <button className="button-box">
          <span className="green">VERIFY NEWS</span>
        </button>
      </div>
    </div>
  );
};

export default VerificationLoader;