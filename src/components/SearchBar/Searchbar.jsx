import "./Searchbar.css";
import { FiSearch } from "react-icons/fi";
import { useState } from "react";

const SearchBar = ({ initialValue = "" }) => {
  const [searchText, setSearchText] = useState(initialValue);

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

        <button className="verify-btn">
          Verify
        </button>
      </div>
    </div>
  );
};

export default SearchBar;