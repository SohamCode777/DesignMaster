import React, { useState } from 'react'
import "./Filter.css";
import drop_down_arrow_dark from "../assets/drop_down_arrow_dark.svg"
import filter_icon from "../assets/filter_icon.svg"

function Filter({
   difficultyFilter,
    setDifficultyFilter,
    projectTypeFilter,
    setProjectTypeFilter,
    domainFilter,
    setDomainFilter,
    openDropdown,
    setOpenDropdown
}) {

   

    const handleFilterClick = () => {
    setOpenDropdown((current) =>
        current === "filter" ? null : "filter"
    );
};

    const toggleFilter = (value, currentValues, setValues) => {
        if (currentValues.includes(value)) {
            setValues(currentValues.filter((item) => item !== value));
        } else {
            setValues([...currentValues, value]);
        }
    };

    const clearFilters = () => {
        setDifficultyFilter([]);
        setProjectTypeFilter([]);
        setDomainFilter([]);
    };

    return (
        <div className="filter-container">

            <div className="filter p" onClick={handleFilterClick}>
                <span className="filter-icon">
                    <img src={filter_icon} alt="" />
                </span>

                <span>Filter</span>

                <span className="dropdown-arrow">
                    <img src={drop_down_arrow_dark} alt="" />
                </span>
            </div>

            {openDropdown === "filter" && (
                <div className="filter-panel">

                    <div className="filter-group">
                        <p className="p filter-group-title">Difficulty</p>

                        <label className="filter-option small">
                            <input
                                type="checkbox"
                                value="beginner"
                                checked={difficultyFilter.includes("beginner")}
                                onChange={() =>
                                    toggleFilter(
                                        "beginner",
                                        difficultyFilter,
                                        setDifficultyFilter
                                    )
                                }
                            />
                            Beginner
                        </label>

                        <label className="filter-option small">
                            <input
                                type="checkbox"
                                value="intermediate"
                                checked={difficultyFilter.includes("intermediate")}
                                onChange={() =>
                                    toggleFilter(
                                        "intermediate",
                                        difficultyFilter,
                                        setDifficultyFilter
                                    )
                                }
                            />
                            Intermediate
                        </label>

                        <label className="filter-option small">
                            <input
                                type="checkbox"
                                value="advanced"
                                checked={difficultyFilter.includes("advanced")}
                                onChange={() =>
                                    toggleFilter(
                                        "advanced",
                                        difficultyFilter,
                                        setDifficultyFilter
                                    )
                                }
                            />
                            Advanced
                        </label>
                    </div>


                    <div className="filter-group">
                        <p className="p filter-group-title">Project Type</p>

                        <label className="filter-option small">
                            <input
                                type="checkbox"
                                value="ui-ux-design"
                                checked={projectTypeFilter.includes("ui-ux-design")}
                                onChange={() =>
                                    toggleFilter(
                                        "ui-ux-design",
                                        projectTypeFilter,
                                        setProjectTypeFilter
                                    )
                                }
                            />
                            UI/UX Design
                        </label>

                        <label className="filter-option small">
                            <input
                                type="checkbox"
                                value="web-design"
                                checked={projectTypeFilter.includes("web-design")}
                                onChange={() =>
                                    toggleFilter(
                                        "web-design",
                                        projectTypeFilter,
                                        setProjectTypeFilter
                                    )
                                }
                            />
                            Web Design
                        </label>

                        <label className="filter-option small">
                            <input
                                type="checkbox"
                                value="brand-identity"
                                checked={projectTypeFilter.includes("brand-identity")}
                                onChange={() =>
                                    toggleFilter(
                                        "brand-identity",
                                        projectTypeFilter,
                                        setProjectTypeFilter
                                    )
                                }
                            />
                            Brand Identity
                        </label>

                        <label className="filter-option small">
                            <input
                                type="checkbox"
                                value="poster-design"
                                checked={projectTypeFilter.includes("poster-design")}
                                onChange={() =>
                                    toggleFilter(
                                        "poster-design",
                                        projectTypeFilter,
                                        setProjectTypeFilter
                                    )
                                }
                            />
                            Poster Design
                        </label>

                        <label className="filter-option small">
                            <input
                                type="checkbox"
                                value="social-media-design"
                                checked={projectTypeFilter.includes("social-media-design")}
                                onChange={() =>
                                    toggleFilter(
                                        "social-media-design",
                                        projectTypeFilter,
                                        setProjectTypeFilter
                                    )
                                }
                            />
                            Social Media Design
                        </label>

                        <label className="filter-option small">
                            <input
                                type="checkbox"
                                value="packaging-design"
                                checked={projectTypeFilter.includes("packaging-design")}
                                onChange={() =>
                                    toggleFilter(
                                        "packaging-design",
                                        projectTypeFilter,
                                        setProjectTypeFilter
                                    )
                                }
                            />
                            Packaging Design
                        </label>

                        <label className="filter-option small">
                            <input
                                type="checkbox"
                                value="advertising-campaign-design"
                                checked={projectTypeFilter.includes("advertising-campaign-design")}
                                onChange={() =>
                                    toggleFilter(
                                        "advertising-campaign-design",
                                        projectTypeFilter,
                                        setProjectTypeFilter
                                    )
                                }
                            />
                            Advertising & Campaign Design
                        </label>

                        <label className="filter-option small">
                            <input
                                type="checkbox"
                                value="presentation-design"
                                checked={projectTypeFilter.includes("presentation-design")}
                                onChange={() =>
                                    toggleFilter(
                                        "presentation-design",
                                        projectTypeFilter,
                                        setProjectTypeFilter
                                    )
                                }
                            />
                            Presentation Design
                        </label>
                    </div>


                    <div className="filter-group">
                        <p className="p filter-group-title">Domain</p>

                        <label className="filter-option small">
                            <input
                                type="checkbox"
                                value="technology"
                                checked={domainFilter.includes("technology")}
                                onChange={() =>
                                    toggleFilter(
                                        "technology",
                                        domainFilter,
                                        setDomainFilter
                                    )
                                }
                            />
                            Technology
                        </label>

                        <label className="filter-option small">
                            <input
                                type="checkbox"
                                value="finance"
                                checked={domainFilter.includes("finance")}
                                onChange={() =>
                                    toggleFilter(
                                        "finance",
                                        domainFilter,
                                        setDomainFilter
                                    )
                                }
                            />
                            Finance
                        </label>

                        <label className="filter-option small">
                            <input
                                type="checkbox"
                                value="healthcare"
                                checked={domainFilter.includes("healthcare")}
                                onChange={() =>
                                    toggleFilter(
                                        "healthcare",
                                        domainFilter,
                                        setDomainFilter
                                    )
                                }
                            />
                            Healthcare
                        </label>

                        <label className="filter-option small">
                            <input
                                type="checkbox"
                                value="education"
                                checked={domainFilter.includes("education")}
                                onChange={() =>
                                    toggleFilter(
                                        "education",
                                        domainFilter,
                                        setDomainFilter
                                    )
                                }
                            />
                            Education
                        </label>

                        <label className="filter-option small">
                            <input
                                type="checkbox"
                                value="food-lifestyle"
                                checked={domainFilter.includes("food-lifestyle")}
                                onChange={() =>
                                    toggleFilter(
                                        "food-lifestyle",
                                        domainFilter,
                                        setDomainFilter
                                    )
                                }
                            />
                            Food & Lifestyle
                        </label>

                        <label className="filter-option small">
                            <input
                                type="checkbox"
                                value="entertainment"
                                checked={domainFilter.includes("entertainment")}
                                onChange={() =>
                                    toggleFilter(
                                        "entertainment",
                                        domainFilter,
                                        setDomainFilter
                                    )
                                }
                            />
                            Entertainment
                        </label>
                    </div>


                    <button
                        type="button"
                        className="clear-filters-button small"
                        onClick={clearFilters}
                    >
                        Clear Filters
                    </button>

                </div>
            )}

        </div>
    )
}

export default Filter

