import React, { useState } from "react";
import "./Header.css";

const Header = ({ headerName, setSearch }) => {
  const handleSearchChange = (event) => {
    setSearch(event.target.value); // Update local query state
  };

  return (
    <nav className="navbar navbar-expand-lg custom-navbar fixed-top">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          {headerName}
        </a>
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
              <a
                className="nav-link active custom-text"
                aria-current="page"
                href="#"
              >
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link custom-text" href="#">
                Link
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
