import { useState } from "react";
import { useLocation } from "react-router-dom";

import Navbar from "../components/Navbar/Navbar";
import SearchBar from "../components/SearchBar/Searchbar";
import VerificationResult from "../components/VerificationResult/VerificationResult";
import VerificationSummary from "../components/VerificationSummary/VerificationSummary";
import MatchingArticles from "../components/MatchingArticles/MatchingArticles";
import TrustedSources from "../components/TrustedSources/TrustedSources";

import "./VerifyNews.css";


const VerifyNews = () => {
    const location=useLocation();
    const news = location.state?.news || "";
    const [result, setResult] = useState(null);

  return (
    <>
      <div className="verify-page">
        <SearchBar initialValue={news}
    setResult={setResult}/>

        <div className="verify-content">

    <VerificationResult result={result} />

    <div className="verify-info-grid">
        <VerificationSummary result={result} />
        <TrustedSources result={result}/>
    </div>

    <MatchingArticles result={result} />

</div> 
      </div>
    </>
  );
};

export default VerifyNews;