import React, { useState } from "react";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";

const Header = ({ headerName, setSearch }) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false); // Track visibility of search input
  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setSearch(event.target.value); // Update search state
  };

  const toggleSearch = () => {
    setIsSearchVisible((prev) => !prev); // Toggle visibility
  };

  return (
    <nav className="navbar navbar-expand-lg custom-navbar fixed-top">
      <div className="container-fluid">
        {isSearchVisible ? (
          <div className="search-bar-container">
          
            <input
              className="form-control me-2 search-input"
              type="search"
              placeholder="Search products..."
              aria-label="Search"
              onChange={handleSearchChange}
            />
              <button className="close-search-btn" onClick={toggleSearch}>
              <i className="fa fa-times"></i> {/* Close Icon */}
            </button>
          </div>
        ) : (
          <>
            <button className="search-icon-btn" onClick={toggleSearch}>
              <i className="fa fa-search"></i> {/* Font Awesome Search Icon */}
            </button>
            <Link className="navbar-brand" href="#">
              {headerName}
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link
                    className="nav-link active custom-text"
                    aria-current="page"
                    href="#"
                  >
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link custom-text" to="/history">
                    Order History
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link custom-text" to="/customer-data">
                    Customer Data
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link custom-text" to="/printer">
                    printer
                  </Link>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
