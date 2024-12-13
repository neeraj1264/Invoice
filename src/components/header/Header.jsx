import React, { useState } from "react";
import "./Header.css";

const Header = ({ headerName, onSearch, showSearch = true  }) => {
    const [query, setQuery] = useState("");
  
    const handleSearchChange = (event) => {
      setQuery(event.target.value); // Update local query state
    };
  
    const handleSearchClick = () => {
      onSearch(query); // Trigger the search with the current query
      // Close the navbar toggle
    const navbarToggler = document.querySelector(".navbar-collapse");
    if (navbarToggler.classList.contains("show")) {
      const bsCollapse = new bootstrap.Collapse(navbarToggler, {
        toggle: false,
      });
      bsCollapse.hide(); // Close the navbar
    }
    };
  
  return (
<nav className="navbar navbar-expand-lg custom-navbar fixed-top">
<div className="container-fluid">
        <a className="navbar-brand" href="#">
          {headerName}
        </a>
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
              <a className="nav-link active custom-text" aria-current="page" href="#">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link custom-text" href="#">
                Link
              </a>
            </li>
          </ul>
          <form className="d-flex" role="search" onSubmit={(e) => e.preventDefault()}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search invoice products..."
              aria-label="Search"
              value={query}
              onChange={handleSearchChange}
            />
            <button
              className="btn btn-outline-success"
              type="button"
              onClick={handleSearchClick}
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Header;
