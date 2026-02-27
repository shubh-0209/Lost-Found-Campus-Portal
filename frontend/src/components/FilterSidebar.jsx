import React, { useState } from "react";

const FilterSidebar = ({ setFilters }) => {
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const applyFilters = () => {
    setFilters({ category, status });
  };

  const resetFilters = () => {
    setCategory("");
    setStatus("");
    setFilters({});
  };

  return (
    <div className="sidebar">
  <h4>Filters</h4>

  <label>Category</label>
  <select value={category} onChange={(e) => setCategory(e.target.value)}>
    <option value="">All</option>
    <option value="Electronics">Electronics</option>
    <option value="Bags">Bags</option>
    <option value="ID Cards">ID Cards</option>
    <option value="Other">Other</option>
  </select>

  <label>Status</label>
  <select value={status} onChange={(e) => setStatus(e.target.value)}>
    <option value="">All</option>
    <option value="lost">Lost</option>
    <option value="found">Found</option>
  </select>

  <button className="filter-btn" onClick={applyFilters}>Apply</button>
  <button className="reset-btn" onClick={resetFilters}>Reset</button>
</div>
  );
};

export default FilterSidebar;