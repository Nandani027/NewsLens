import "./SearchBar.css";
import { FiSearch } from "react-icons/fi";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const SearchBar = ({ initialValue = "", setResult, setLoading, setError }) => {
  const location = useLocation();

  const [searchText, setSearchText] = useState(
    location.state?.news || initialValue
  );
  const [loading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const verifyNews = useCallback(
    async (text = searchText) => {
      if (!text || !text.trim()) return;

      try {
        setIsLoading(true);
        setErrorMessage("");
        if (setLoading) setLoading(true);
        if (setError) setError("");
        if (setResult) setResult(null);

        const response = await axios.post(
          "https://newslens-production-4e6e.up.railway.app/verify",
          { input: text.trim() }
        );

        console.log("Backend Data Received:", response.data);

        if (response.data.success) {
          if (setResult) setResult(response.data);
        } else {
          const msg = response.data.message || "Verification failed.";
          setErrorMessage(msg);
          if (setError) setError(msg);
        }
      } catch (error) {
        console.error("Verification failed:", error?.response?.data || error.message);

        // Extract detailed backend message (e.g. 503 service busy) or fallback to generic text
        const backendMsg =
          error?.response?.data?.message ||
          "Service is temporarily unavailable or under heavy load. Please try again in a few seconds.";

        setErrorMessage(backendMsg);
        if (setError) setError(backendMsg);
      } finally {
        setIsLoading(false);
        if (setLoading) setLoading(false);
      }
    },
    [searchText, setLoading, setResult, setError]
  );

  useEffect(() => {
    if (location.state?.news) {
      setSearchText(location.state.news);
      verifyNews(location.state.news);
    }
  }, [location.state?.news, verifyNews]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      verifyNews();
    }
  };

  return (
    <div className="verify-search-container">
      <div className="verify-search-box">
        <FiSearch className="verify-search-icon" />

        <input
          type="text"
          placeholder="Enter news headline or paste URL..."
          className="search-input"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />

        <button
          className="verify-btn"
          onClick={() => verifyNews()}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </div>

      {/* Render error banner if request fails */}
      {errorMessage && (
        <div className="search-error-banner" >
          ⚠️ {errorMessage}
        </div>
      )}
    </div>
  );
};

export default SearchBar;