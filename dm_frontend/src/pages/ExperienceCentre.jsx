import React, { useEffect, useState } from 'react'
import axios from 'axios'
import "./ExperienceCentre.css"
import ExperienceItem from '../compoents/ExperienceItem'
import SearchBar from '../compoents/SearchBar'
import Filter from '../compoents/Filter'
import Sort from '../compoents/Sort'


function ExperienceCentre() {

  const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("active");
    const [recentlyOpened, setRecentlyOpened] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [difficultyFilter, setDifficultyFilter] = useState([]);
    const [projectTypeFilter, setProjectTypeFilter] = useState([]);
    const [domainFilter, setDomainFilter] = useState([]);
    const [sortOrder, setSortOrder] = useState("newest");
    const [openDropdown, setOpenDropdown] = useState(null);

   const filteredConversations = conversations
    .filter((conversation) =>
        conversation.status === activeTab
    )
    .filter((conversation) =>
        conversation.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    )
    .filter((conversation) =>
        difficultyFilter.length === 0 ||
        difficultyFilter.includes(conversation.difficulty.toLowerCase())
    )
    .filter((conversation) =>
        projectTypeFilter.length === 0 ||
        projectTypeFilter.includes(conversation.project_type.toLowerCase())
    )
    .filter((conversation) =>
        domainFilter.length === 0 ||
        domainFilter.includes(conversation.domain.toLowerCase())
    );


    const sortedConversations = [...filteredConversations].sort((a, b) => {
    if (sortOrder === "newest") {
        return new Date(b.created_at) - new Date(a.created_at);
    }

    if (sortOrder === "oldest") {
        return new Date(a.created_at) - new Date(b.created_at);
    }

    if (sortOrder === "a-z") {
        return a.title.localeCompare(b.title);
    }

    if (sortOrder === "z-a") {
        return b.title.localeCompare(a.title);
    }

    return 0;
});


//     const fakeConversation = {
//     id: 1,
//     title: "Reimagining the Complete Digital Banking Experience",
//     projectType: "ui-ux-design",
//     domain: "finance",
//     difficulty: "intermediate",
//     client: "Finly",
//     challenge: "Create a simpler and more engaging personal finance experience.",
//     deliverables: [
//         "User Flow",
//         "Low-Fidelity Wireframes",
//         "High-Fidelity Mobile Screens"
//     ],
//     status: "active"
// };





    const getConversations = async () => {
        try {

            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/experience/get-conversations`,
                {
                    withCredentials: true
                }
            );

            setConversations(response.data.conversations);

        } catch (error) {

            console.log(
                "GET EXPERIENCE CONVERSATIONS ERROR:",
                error.response?.data
            );

        } finally {

            setLoading(false);

        }
    };

    const getRecentlyOpened = async () => {
    try {

        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/experience/recently-opened`,
            {
                withCredentials: true
            }
        );

        setRecentlyOpened(response.data.conversations);

    } catch (error) {

        console.log(
            "GET RECENTLY OPENED ERROR:",
            error.response?.data
        );

    }
};


const handleConversationDeleted = (conversationId) => {
    setConversations((prev) =>
        prev.filter((conversation) => conversation.id !== conversationId)
    );

    setRecentlyOpened((prev) =>
        prev.filter((conversation) => conversation.id !== conversationId)
    );
};

const handleConversationClosed = (conversationId) => {
    setConversations((prev) =>
        prev.map((conversation) =>
            conversation.id === conversationId
                ? { ...conversation, status: "closed" }
                : conversation
        )
    );

    setRecentlyOpened((prev) =>
        prev.filter((conversation) => conversation.id !== conversationId)
    );
};

    useEffect(() => {
        getConversations();
        getRecentlyOpened();
    }, []);


  return (
    <div className='body-container'>
      
      <h2 className='h2 experience-centre-title'>Experience Centre</h2>

      <div className='recently-opened'>
        <h5 className='h5'>Recently Opened</h5>
        <div className='recently-opened-items'>
           {recentlyOpened.length === 0 ? (
                    <p className='p' style={{ color: '#656565' }}>No recently opened conversations.</p>
                ) : (
                    recentlyOpened.map((conversation) => (
                        <ExperienceItem
                            key={conversation.id}
                            conversation={{
                                id: conversation.id,
                                title: conversation.title,
                                projectType: conversation.project_type,
                                domain: conversation.domain,
                                difficulty: conversation.difficulty,
                                client: conversation.client,
                                challenge: conversation.challenge,
                                deliverables: conversation.deliverables,
                                status: conversation.status
                            }}
                            onDeleted={handleConversationDeleted}
                            onClosed={handleConversationClosed}
                        />
                    ))
                )}
        </div>
        <div className='horizontal-line'></div>
      </div>

     <div className='all-experience-topic-section'>

            <div className='all-experience-topic-heading-and-functions'>

                <div className='all-experience-topic-heading'>
                        <div className='experience-topic-tabs'>

                            <div
                                className={`h6 experience-topic-tab ${ activeTab === "active" ? "active" : "" }`}
                                onClick={() => setActiveTab("active")}
                            >
                                <p>Active Conversations</p>
                            </div>

                            <div
                                className={`h6 experience-topic-tab ${ activeTab === "closed" ? "active" : "" }`}
                                onClick={() => setActiveTab("closed")}
                            >
                                <p>Closed Conversations</p>
                            </div>

                        </div>
                </div>

                <div className='search-sort-filter-functions'>
                    <SearchBar
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />

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

        <div className='all-experience-topic-content'>

                {loading ? (

                    <p className='p' style={{ color: '#656565' }}>
                        Loading conversations...
                    </p>

                ) : conversations.filter(
                    (conversation) => conversation.status === activeTab
                ).length === 0 ? (

                    <p className='p' style={{ color: '#656565' }}>
                        No {activeTab === "active" ? "active" : "closed"} conversations.
                    </p>

                ) : sortedConversations.length === 0 ? (

                    <p className='p' style={{ color: '#656565' }}>
                        No conversations found.
                    </p>

                ) : (

                    sortedConversations.map((conversation) => (
                        <ExperienceItem
                            key={conversation.id}
                            conversation={{
                                id: conversation.id,
                                title: conversation.title,
                                projectType: conversation.project_type,
                                domain: conversation.domain,
                                difficulty: conversation.difficulty,
                                client: conversation.client,
                                challenge: conversation.challenge,
                                deliverables: conversation.deliverables,
                                status: conversation.status
                            }}
                            onDeleted={handleConversationDeleted}
                            onClosed={handleConversationClosed}
                        />
                    ))

                )}

            </div>

        </div>

    </div>
  )
}

export default ExperienceCentre