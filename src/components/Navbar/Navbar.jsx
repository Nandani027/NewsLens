import "./Navbar.css";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">

      <div className="logo">
        <FaSearch className="logo-icon" />
        <span>NewsLens</span>
      </div>

      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li>
          <NavLink to="/" onClick={closeMenu}>Home</NavLink>
        </li>

        <li>
          <NavLink to="/latest-news" onClick={closeMenu}>Latest News</NavLink>
        </li>

        <li>
          <NavLink to="/verify-news" onClick={closeMenu}>Verify News</NavLink>
        </li>
      </ul>
      <div
        className="toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>
   

    </nav>
  );
}

export default Navbar;