import "./Searchbar.css";
import { FiSearch } from "react-icons/fi";
import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const SearchBar = ({ initialValue = "", setResult, setLoading }) => {
  const location = useLocation();

  const [searchText, setSearchText] = useState(
    location.state?.news || initialValue
  );

  const [loading, setIsLoading] = useState(false);

  const verifyNews = async (text = searchText) => {
    if (!text || !text.trim()) return;

    try {
      setIsLoading(true);
      if (setLoading) setLoading(true);
      if (setResult) setResult(null);

      const response = await axios.post("http://localhost:5000/verify", {
        input: text.trim(),
      });
      console.log("Backend Data Received:", response.data);

      if (setResult) setResult(response.data);
    } catch (error) {
      console.error("Verification failed:", error?.response?.data || error.message);
    } finally {
      setIsLoading(false);
      if (setLoading) setLoading(false);
    }
  };

  useEffect(() => {
    if (location.state?.news) {
      setSearchText(location.state.news);
      verifyNews(location.state.news);
    }

  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
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
        />

        <button
          className="verify-btn"
          onClick={() => verifyNews()}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </div>
    </div>
  );
};

export default SearchBar;