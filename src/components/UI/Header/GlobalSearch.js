import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { prepGlobalSearchInput } from "../../../services/helpers";

const GlobalSearch = () => {
  const [searchValue, setSearchValue] = useState("");
  const reduxSearchValue = useSelector(state => state.search.searchValue || "");

  let history = useHistory();

  useEffect(() => {
    setSearchValue(reduxSearchValue);
  }, [reduxSearchValue]);

  const handleSubmit = e => {
    e.preventDefault();
    history.push(prepGlobalSearchInput(searchValue));
  };

  const handleSearchChange = e => {
    setSearchValue(e.target.value);
  };

  return (
    <div
      id="search"
      data-testid="global-search-desktop-wrapper"
      className="hide-mobile"
    >
      <div className="search-form searchblox">
        <form role="search" onSubmit={handleSubmit}>
          <label className="hide-label" htmlFor="q-desktop">
            Search this website
          </label>
          <input
            placeholder="Search the collection"
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
          />
          <input type="hidden" name="advanced" value="false" />
          <button type="submit">
            <span className="hide-label">Search</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default GlobalSearch;
