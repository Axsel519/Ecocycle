import { useState } from "react";
import { NavLink } from "react-router-dom";
import "../Styles/Header.css";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo Section */}
        <div className="logo-container" onClick={closeMenu}>
          <div className="logo-icon">
            <img
              src="/images/Ecocycle.png"
              alt="EcoCycle Logo"
              className="logo-image"
            />
          </div>
          <span className="logo-text">
            Eco<span className="logo-text-bold">Cycle</span>
          </span>
        </div>

        {/* Hamburger Toggle Button */}
        <button
          className="menu-toggle-btn"
          onClick={toggleMenu}
          aria-label="Toggle Navigation"
        >
          <i class="bi bi-text-left"></i>{" "}
        </button>

        {/* Navigation Content Wrapper */}
        <div className={`nav-content-wrapper ${isMenuOpen ? "open" : ""}`}>
          {/* Navigation Links */}
          <nav className="nav-links">
            <NavLink to="/" onClick={closeMenu}>
              Home
            </NavLink>
            <NavLink to="/how-it-works" onClick={closeMenu}>
              How It Works
            </NavLink>
            <NavLink to="/rewards" onClick={closeMenu}>
              Rewards
            </NavLink>
            <NavLink to="/pickup" onClick={closeMenu}>
              Pickup
            </NavLink>
            <NavLink to="/dashboard" onClick={closeMenu}>
              Dashboard
            </NavLink>
          </nav>

          {/* Login Section */}
          <NavLink to="/login" className="login-bt" onClick={closeMenu}>
            <i className="bi bi-person-circle"></i> Login
          </NavLink>
        </div>
      </div>
    </header>
  );
}

export default Header;
