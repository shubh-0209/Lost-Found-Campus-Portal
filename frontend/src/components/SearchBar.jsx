import React, { useState } from "react";

const SearchBar = ({ setSearch }) => {
  const [value, setValue] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(value);
  };

  return (
    <form onSubmit={handleSearch} className="search-bar">
  <input
    type="text"
    placeholder="Search by item name or location..."
    className="search-input"
    value={value}
    onChange={(e) => setValue(e.target.value)}
  />
  <button className="search-btn">Search</button>
</form>
  );
};

export default SearchBar;