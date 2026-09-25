import React from 'react'
import"./SavedTopicItem.css";
import thumbnail_image from "../assets/thumbnail_image.png";
import delete_icon from "../assets/delete_icon.svg"
import { projectTypeLabels,domainLabels,difficultyLabels } from '../assets/labels.js';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { toast } from 'react-toastify';

function SavedTopicItem({topic, onDelete}) {

//     const topic = {
//     id: 1,
//     title: "Reimagining the Complete Digital Banking Experience for a Next Generation Financial Platform Designed to Make Personal Finance Management Simpler, Smarter, More Accessible, and More Engaging for Everyday Users",
//     projectType: "ui-ux-design",
//     domain: "technology",
//     difficulty: "intermediate",
//     client: "EcoCart",
//     challenge: "Improve the shopping experience for sustainable products.",
//     deliverables: [
//         "User Flow",
//         "Low-Fidelity Wireframes",
//         "High-Fidelity Mobile Screens"
//     ],
//     createdAt: "2026-09-25T20:30:00"
// };

const navigate = useNavigate();

    const handleTopicClick = () => {
       navigate(`/topic/${topic.id}`);
    };


  const handleDelete = async (e) => {
    e.stopPropagation();

    try {
        await axios.delete(
            `${import.meta.env.VITE_BACKEND_URL}/api/topic/delete-saved-topic/${topic.id}`,
            { withCredentials: true }
        );

        onDelete(topic.id);

        toast.success("Topic Deleted")

    } catch (error) {
        console.log(error.response?.data);
         toast.error(
            error.response?.data?.message || "Failed to delete topic"
        );
    }
};  

  return (
    <div className="saved-topic-container" onClick={handleTopicClick}>

            <div className="saved-topic-thumbnail">
                <img
                    src={thumbnail_image}
                />

                <button className="delete-topic-button" onClick={handleDelete}>
                    <img  src={delete_icon} alt="" />
                </button>
            </div>

            <div className="saved-topic-details">

                
              <div className='micro-topic-pills'>
                        <div className='micro-topic-pill small micro-topic-pill-projectType'>{projectTypeLabels[topic.projectType.toLowerCase()]}</div>
                        <div className='micro-topic-pill small micro-topic-pill-domain'> {domainLabels[topic.domain.toLowerCase()]}</div>
                       <div className={`micro-topic-pill small ${
                              topic.difficulty.toLowerCase() === "beginner"
                                  ? "micro-topic-pill-difficulty-beginner"
                                  : topic.difficulty.toLowerCase() === "intermediate"
                                  ? "micro-topic-pill-difficulty-intermediate"
                                  : "micro-topic-pill-difficulty-advanced"
                          }`}>
                              {difficultyLabels[topic.difficulty.toLowerCase()]}
                          </div>
                 </div>

                 <p className=" h6 saved-topic-title">{topic.title}</p>

            </div>

        </div>
  )
}

export default SavedTopicItem