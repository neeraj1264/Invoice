import React, { useState } from "react";
import "./Header.css";
import { Link , useNavigate } from "react-router-dom";

const Header = ({ headerName, setSearch }) => {
  const handleSearchChange = (event) => {
    setSearch(event.target.value); // Update local query state
  };
    const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg custom-navbar fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand" href="#">
          {headerName}
        </Link>
        <div className="search-container">
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search products..."
            aria-label="Search"
            // value={query}
            onChange={handleSearchChange}
          />
        </div>
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
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
