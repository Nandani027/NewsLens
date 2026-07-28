import Navbar from "../components/Navbar/Navbar";
import SearchBar from "../components/SearchBar/Searchbar";
import VerificationResult from "../components/VerificationResult/VerificationResult";
import VerificationSummary from "../components/VerificationSummary/VerificationSummary";
import MatchingArticles from "../components/MatchingArticles/MatchingArticles";
import TrustedSources from "../components/TrustedSources/TrustedSources";
import { useLocation } from "react-router-dom";
import "./VerifyNews.css";


const VerifyNews = () => {
    const location=useLocation();
    const news = location.state?.news || "";

  return (
    <>
      <div className="verify-page">
        <SearchBar initialValue={news} />

        <div className="verify-content">

    <VerificationResult />

    <div className="verify-info-grid">
        <VerificationSummary />
        <TrustedSources />
    </div>

    <MatchingArticles />

</div> 
      </div>
    </>
  );
};

export default VerifyNews;