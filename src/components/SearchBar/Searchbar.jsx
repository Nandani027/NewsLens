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
    if (!text.trim()) return;

    try {
     
      setIsLoading(true);
      if (setLoading) setLoading(true);

  
      setResult(null);

      const response = await axios.post(
        "http://localhost:5000/verify",
        {
          input: text,
        }
      );

      setResult(response.data);
    } catch (error) {
      console.error("Verification failed:", error);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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