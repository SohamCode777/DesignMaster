import React from 'react'
import "./SearchBar.css";
import search_icon from "../assets/search_icon.svg"

function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div className="search-bar">
      <input
        className="small"
        type="text"
        placeholder="Search By Title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="search-icon">
        <img src={search_icon} alt="Search-icon" />
      </div>
    </div>
  )
}

export default SearchBar