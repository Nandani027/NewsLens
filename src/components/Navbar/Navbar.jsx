import "./Navbar.css";
import { NavLink } from "react-router-dom";
import { FaSearch, FaRegUser } from "react-icons/fa";

function Navbar() {
  return (
    <nav className="navbar">

      <div className="logo">
        <FaSearch className="logo-icon" />
        <span>NewsLens</span>
      </div>

      <ul className="nav-links">
        <li>
          <NavLink to="/">Home</NavLink>
        </li>

        <li>
          <NavLink to="/latest-news">Latest News</NavLink>
        </li>

        <li>
          <NavLink to="/verify-news">Verify News</NavLink>
        </li>
      </ul>

   

    </nav>
  );
}

export default Navbar;