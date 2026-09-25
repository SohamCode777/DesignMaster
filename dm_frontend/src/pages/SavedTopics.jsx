import React, { useEffect, useState } from 'react'
import axios from 'axios'
import "./SavedTopics.css"
import SearchBar from '../compoents/SearchBar'
import Filter from '../compoents/Filter'
import Sort from '../compoents/Sort'
import SavedTopicItem from '../compoents/SavedTopicItem'

function SavedTopics() {

  const [savedTopics, setSavedTopics] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState([]);
  const [projectTypeFilter, setProjectTypeFilter] = useState([]);
  const [domainFilter, setDomainFilter] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest");
  const [openDropdown, setOpenDropdown] = useState(null);

  const filteredTopics = savedTopics
      .filter((topic) =>
          topic.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((topic) =>
          difficultyFilter.length === 0 ||
          difficultyFilter.includes(topic.difficulty.toLowerCase())
      )
      .filter((topic) =>
          projectTypeFilter.length === 0 ||
          projectTypeFilter.includes(topic.projectType.toLowerCase())
      )
      .filter((topic) =>
          domainFilter.length === 0 ||
          domainFilter.includes(topic.domain.toLowerCase())
      );


  const sortedTopics = [...filteredTopics].sort((a, b) => {
    if (sortOrder === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
    }

    if (sortOrder === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
    }

    if (sortOrder === "a-z") {
        return a.title.localeCompare(b.title);
    }

    if (sortOrder === "z-a") {
        return b.title.localeCompare(a.title);
    }

    return 0;
});



    const getSavedTopics = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/topic/get-saved-topics`,
                { withCredentials: true }
            );

            console.log(response.data);

           setSavedTopics(response.data.topics);

        } catch (error) {
            console.log(error.response?.data);
        }
    };

    const handleDeleteTopic = (topicId) => {
          setSavedTopics((currentTopics) =>
              currentTopics.filter((topic) => topic.id !== topicId)
          );
      };


    


    useEffect(() => {
        getSavedTopics();
    }, []);


  return (
    <div className='body-container'>
      <h2 className='h2 saved-topics-title'>Saved Topics</h2>
      <div className='heading-and-functions'>

        <div className='heading-your-inspirations'><h5 className='h5'>Your Inspirations</h5></div>
        <div className='search-sort-filter-functions'>
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          
            <Filter
                difficultyFilter={difficultyFilter}
                setDifficultyFilter={setDifficultyFilter}
                projectTypeFilter={projectTypeFilter}
                setProjectTypeFilter={setProjectTypeFilter}
                domainFilter={domainFilter}
                setDomainFilter={setDomainFilter}
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
            />

            <Sort
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
            />
        </div>

      </div>

     <div className="saved-topics-content">

              {savedTopics.length === 0 ? (
                  <div className="saved-topics-empty">
                      <p className='h5'>No saved topics yet. :)</p>
                  </div>
              ) : filteredTopics.length === 0 ? (
                  <div className="saved-topics-no-results">
                      <p className='h5'>No topics found! :)</p>
                  </div>
              ) : (
                  <div className="saved-topic-views">
                      {sortedTopics.map((topic) => (
                          <SavedTopicItem
                              key={topic.id}
                              topic={topic}
                              onDelete={handleDeleteTopic}
                          />
                      ))}
                  </div>
              )}

          </div>


    </div>
  )
}

export default SavedTopics