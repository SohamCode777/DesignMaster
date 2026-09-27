import React from 'react'
import "./ExperienceItem.css";
import thumbnail_image from "../assets/thumbnail_image.png";
import { projectTypeLabels, domainLabels, difficultyLabels } from '../assets/labels.js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ExperienceItem({ conversation, onDeleted, onClosed  }) {

    const navigate = useNavigate();

const handleConversationClick = () => {
    navigate(`/experience/${conversation.id}`);
};


const handleDelete = async (e) => {
    e.stopPropagation();

    try {

        await axios.delete(
            `${import.meta.env.VITE_BACKEND_URL}/api/experience/delete/${conversation.id}`,
            {
                withCredentials: true
            }
        );


        onDeleted(conversation.id);

        console.log("Conversation deleted successfully");

    } catch (error) {

        console.log(
            "DELETE EXPERIENCE CONVERSATION ERROR:",
            error.response?.data
        );

    }
};


const handleClose = async (e) => {
    e.stopPropagation();

    try {

        await axios.patch(
            `${import.meta.env.VITE_BACKEND_URL}/api/experience/close/${conversation.id}`,
            {},
            {
                withCredentials: true
            }
        );

        onClosed(conversation.id);

        console.log("Conversation closed successfully");

    } catch (error) {

        console.log(
            "CLOSE EXPERIENCE CONVERSATION ERROR:",
            error.response?.data
        );

    }
};



    return (
        <div className="experience-item-container" onClick={handleConversationClick}>

            <div className="experience-item-thumbnail">
                <img
                    src={thumbnail_image}
                    alt=""
                />

                <div className="experience-item-menu">
                        <button className="experience-item-menu-button" onClick={(e) => e.stopPropagation()}>
                            ⋮
                        </button>

                        <div className="experience-item-dropdown">
                            <p className="p experience-item-dropdown-option" onClick={handleDelete}>
                                Delete
                            </p>

                            <p className="p experience-item-dropdown-option" onClick={handleClose}>
                                End Conversation
                            </p>
                        </div>
                    </div>
            </div>

            <div className="experience-item-details">

                <div className="micro-topic-pills">
                    <div className="micro-topic-pill small micro-topic-pill-projectType">
                        {projectTypeLabels[conversation.projectType.toLowerCase()]}
                    </div>

                    <div className="micro-topic-pill small micro-topic-pill-domain">
                        {domainLabels[conversation.domain.toLowerCase()]}
                    </div>

                    <div className={`micro-topic-pill small ${
                        conversation.difficulty.toLowerCase() === "beginner"
                            ? "micro-topic-pill-difficulty-beginner"
                            : conversation.difficulty.toLowerCase() === "intermediate"
                            ? "micro-topic-pill-difficulty-intermediate"
                            : "micro-topic-pill-difficulty-advanced"
                    }`}>
                        {difficultyLabels[conversation.difficulty.toLowerCase()]}
                    </div>
                </div>

                <p className="h6 experience-item-title">
                    {conversation.title}
                </p>

            </div>

        </div>
    )
}

export default ExperienceItem;