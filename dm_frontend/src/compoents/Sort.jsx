
import React, { useState } from 'react'
import "./Sort.css";
import sort_icon from "../assets/sort_icon.svg"

function Sort({  sortOrder,
    setSortOrder,
    openDropdown,
    setOpenDropdown}) {

    

   const handleSortClick = () => {
    setOpenDropdown((current) =>
        current === "sort" ? null : "sort"
    );
};

    const handleSortChange = (value) => {
        setSortOrder(value);
    };

    const clearSort = () => {
        setSortOrder("newest");
    };

    return (
        <div className="sort-container">

            <div className="sort" onClick={handleSortClick}>
                <img src={sort_icon} alt="Sort" />
            </div>

            {openDropdown === "sort" && (
                <div className="sort-panel">

                    <p
                        className={`p sort-option small ${
                            sortOrder === "newest" ? "selected-sort" : ""
                        }`}
                        onClick={() => handleSortChange("newest")}
                    >
                        Newest → Oldest
                    </p>

                    <p
                        className={`p sort-option small ${
                            sortOrder === "oldest" ? "selected-sort" : ""
                        }`}
                        onClick={() => handleSortChange("oldest")}
                    >
                        Oldest → Newest
                    </p>

                    <p
                        className={`p sort-option small ${
                            sortOrder === "a-z" ? "selected-sort" : ""
                        }`}
                        onClick={() => handleSortChange("a-z")}
                    >
                        A → Z
                    </p>

                    <p
                        className={`p sort-option small ${
                            sortOrder === "z-a" ? "selected-sort" : ""
                        }`}
                        onClick={() => handleSortChange("z-a")}
                    >
                        Z → A
                    </p>

                    <button
                        type="button"
                        className="clear-sort-button small"
                        onClick={clearSort}
                    >
                        Clear Sort
                    </button>

                </div>
            )}

        </div>
    )
}

export default Sort

