import "./Hero.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "../../assets/hero.png";


function Hero() {
  const navigate = useNavigate();
  const [newsInput, setNewsInput] = useState("");

  const handleVerify = () => {
    navigate("/verify-news", {
      state: {
        news: newsInput,
      },
    });
  };

  return (
    <section className="hero">
      <div className="hero-left">
        <h1>
          VERIFY <br />
          THE NEWS.
        </h1>

        <h2>
          TRUST WHAT <br />
          IS TRUE.
        </h2>

        <p>
          Paste a headline or URL and let NewsLens check it across
          trusted news sources to help you separate facts from fiction.
        </p>

        <div className="search-box">
          <input
            type="text"
            placeholder="Enter news headline or paste URL..."
            value={newsInput}
            onChange={(e) => setNewsInput(e.target.value)}
          />

          <button onClick={handleVerify}>
            Verify Now →
          </button>
        </div>
      </div>
      <div className="hero-right">
  <div className="image-stack">

    <div className="card card-back"></div>

    <div className="card card-middle"></div>

    <div className="card card-front">
      <img src={heroImage} alt="News" />
    </div>

    <div className="verification-card">

      <div className="verify-icon">
        ✓
      </div>

      <div className="verify-text">
        <span>VERIFICATION RESULT</span>

        <h3>VERIFIED</h3>

        <p>
          This news is covered by multiple trusted sources.
        </p>
      </div>

    </div>

  </div>
</div>
      
    </section>
  );
}

export default Hero;