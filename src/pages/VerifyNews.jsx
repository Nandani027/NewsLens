import { useState } from "react";
import { useLocation } from "react-router-dom";

import SearchBar from "../components/SearchBar/Searchbar";
import VerificationResult from "../components/VerificationResult/VerificationResult";
import VerificationSummary from "../components/VerificationSummary/VerificationSummary";
import MatchingArticles from "../components/MatchingArticles/MatchingArticles";
import TrustedSources from "../components/TrustedSources/TrustedSources";
import VerificationLoader from "../components/VerificationLoader/VerificationLoader";

import "./VerifyNews.css";

const VerifyNews = () => {
  const location = useLocation();
  const news = location.state?.news || "";

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  return (
    <div className="verify-page">
      <SearchBar
        initialValue={news}
        setResult={setResult}
        setLoading={setLoading}
      />

      <div className="verify-content">
        {loading && <VerificationLoader />}

        {!loading && result && (
          <>
            <VerificationResult result={result} />

            <div className="verify-info-grid">
              <VerificationSummary result={result} />
              <TrustedSources result={result} />
            </div>

            <MatchingArticles result={result} />
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyNews;