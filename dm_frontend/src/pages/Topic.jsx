import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import "./Topic.css";
import { projectTypeLabels, domainLabels, difficultyLabels } from '../assets/labels';

function Topic() {

    const { topicId } = useParams();
    const navigate = useNavigate();

    const [topic, setTopic] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const getTopic = async () => {

            try {

                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/topic/get-saved-topic/${topicId}`,
                    {
                        withCredentials: true
                    }
                );

                setTopic(response.data.topic);

            } catch (error) {

                console.log("GET TOPIC ERROR:", error.response?.data);

            } finally {

                setLoading(false);

            }
        };

        getTopic();

    }, [topicId]);


    if (loading) {
        return (
            <div className='body-container'>
                <div className='topic-body'>
                    <p className='p'>Loading topic...</p>
                </div>
            </div>
        );
    }


    if (!topic) {
        return (
            <div className='body-container'>
                <div className='topic-body'>
                    <p className='p'>Topic not found.</p>

                    <button
                        className='secondary-button'
                        type="button"
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </button>
                </div>
            </div>
        );
    }


    return (
        <div className='body-container'>
            <div className='topic-body'>

                <div className='topic-detail-section'>

                    <div className='topic-page-topic-section'>

                        <div className='topic-page-topic-pills'>

                            <div className='topic-page-topic-pill small topic-page-topic-pill-projectType'>
                                {projectTypeLabels[topic.projectType.toLowerCase()]}
                            </div>

                            <div className='topic-page-topic-pill small topic-page-topic-pill-domain'>
                                {domainLabels[topic.domain.toLowerCase()]}
                            </div>

                            <div className={`topic-page-topic-pill small ${
                                topic.difficulty.toLowerCase() === "beginner"
                                    ? "topic-page-topic-pill-difficulty-beginner"
                                    : topic.difficulty.toLowerCase() === "intermediate"
                                    ? "topic-page-topic-pill-difficulty-intermediate"
                                    : "topic-page-topic-pill-difficulty-advanced"
                            }`}>
                                {difficultyLabels[topic.difficulty.toLowerCase()]}
                            </div>

                        </div>

                        <h4 className='h3 topic-page-topic-title'>
                            {topic.title}
                        </h4>

                    </div>


                    <div className='topic-page-topic-section'>
                        <h6 className='h5 topic-page-topic-section-title'>
                            Client:
                        </h6>

                        <p className='p topic-page-topic-section-text'>
                            {topic.client}
                        </p>
                    </div>


                    <div className='topic-page-topic-section'>
                        <h6 className='h5 topic-page-topic-section-title'>
                            Challenge:
                        </h6>

                        <p className='p topic-page-topic-section-text'>
                            {topic.challenge}
                        </p>
                    </div>


                    <div className='topic-page-topic-section'>
                        <h6 className='h5 topic-page-topic-section-title'>
                            Deliverables:
                        </h6>

                        <ul className="topic-page-topic-section-text">

                            {topic.deliverables.map((deliverable, index) => (
                                <li
                                    className="p topic-page-list-items"
                                    key={index}
                                >
                                    {deliverable}
                                </li>
                            ))}

                        </ul>
                    </div>

                </div>


                <div className='button-section'>

                    <button
                        className='secondary-button'
                        type="button"
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </button>

                    <button
                        className='primary-button'
                        type="button"
                    >
                        Simulate
                    </button>

                </div>

            </div>
        </div>
    )
}

export default Topic