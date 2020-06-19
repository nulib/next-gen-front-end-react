import React, { useState } from "react";
import MobileNav from "./MobileNav";
import { useHistory } from "react-router-dom";
import { prepGlobalSearchInput } from "../../../services/helpers";

const MobileLinks = props => {
  let history = useHistory();
  const [navOpen, setNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleChange = e => {
    setSearchValue(e.target.value);
  };

  const handleMenuClick = e => {
    setNavOpen(!navOpen);
    setSearchValue(false);
  };

  const handleSearchClick = e => {
    e.preventDefault();
    setNavOpen(false);
    setSearchOpen(!searchOpen);
  };

  const handleSubmit = e => {
    e.preventDefault();
    history.push(prepGlobalSearchInput(searchValue));
    setSearchOpen(false);
  };

  const classes = `mobile-link mobile-nav-link ${navOpen ? "open" : ""}`;
  return (
    <div
      id="mobile-links"
      data-testid="mobile-links"
      aria-label="mobile links navigation"
      aria-expanded={navOpen ? true : false}
      aria-hidden={navOpen ? false : true}
    >
      <button className={classes} onClick={handleMenuClick}>
        <span className="hide-label">Menu</span>
      </button>
      <MobileNav {...props} navOpen={navOpen} closeMenu={handleMenuClick} />

      <button
        className={`mobile-link mobile-search-link ${searchOpen ? "open" : ""}`}
        onClick={handleSearchClick}
      >
        <span className="hide-label" aria-label="open search">
          Search
        </span>
      </button>

      {searchOpen && (
        <div
          id="mobile-search"
          data-testid="mobile-search-wrapper"
          aria-expanded={searchOpen ? true : false}
          aria-hidden={searchOpen ? false : true}
        >
          <div className="search-form group">
            <form onSubmit={handleSubmit} role="search">
              <label className="hide-label" htmlFor="mobile-search-input">
                Search the collection
              </label>
              <input
                id="mobile-search-input"
                placeholder="Search the collection"
                type="text"
                onChange={e => handleChange(e)}
              />
              <button type="submit">
                <span className="hide-label">Search</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileLinks;
