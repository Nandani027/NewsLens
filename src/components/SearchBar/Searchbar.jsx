import "./Searchbar.css";
import { FiSearch } from "react-icons/fi";
import { useState } from "react";
import axios from "axios";

const SearchBar = ({ initialValue = "", setResult }) =>{
  const [searchText, setSearchText] = useState(initialValue);
  const [loading, setLoading] = useState(false);

  const verifyNews = async () => {
     console.log("Verify button clicked");
    if (!searchText.trim()) return;

    try {
        setLoading(true);

        const response = await axios.post(
            "http://localhost:5000/verify",
            {
                input: searchText
            }
        );

        setResult(response.data);

    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
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
        />

        <button
    className="verify-btn"
    onClick={verifyNews}
    disabled={loading}
>
    {loading ? "Verifying..." : "Verify"}
</button>
      </div>
    </div>
  );
};

export default SearchBar;