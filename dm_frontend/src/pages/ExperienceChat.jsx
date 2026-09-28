import React, { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import "./ExperienceChat.css"
import { projectTypeLabels, domainLabels, difficultyLabels } from '../assets/labels.js'
import submit_icon from "../assets/submit_icon.svg";
import upload_icon from "../assets/upload_icon.svg";
import ai_icon from "../assets/ai_icon.svg";
import drop_down_arrow_dark from "../assets/drop_down_arrow_dark.svg";

function ExperienceChat() {
    const navigate = useNavigate();
    const { conversationId } = useParams();

    const [conversation, setConversation] = useState(null);
    const [messages, setMessages] = useState([]);

    const [message, setMessage] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState("");

    const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
    const [showScrollButton, setShowScrollButton] = useState(false);

    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);

    const getExperienceConversation = async () => {
        try {
            setIsLoading(true);
            setError("");

            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/experience/${conversationId}`,
                { withCredentials: true }
            );

            setConversation(response.data.conversation);
            setMessages(response.data.messages);

        } catch (error) {
            console.log(
                "GET EXPERIENCE CONVERSATION ERROR:",
                error.response?.data
            );

            setError(
                error.response?.data?.message ||
                "Failed to load conversation"
            );

        } finally {
            setIsLoading(false);
        }
    };

    const updateLastOpened = async () => {
        try {
            await axios.patch(
                `${import.meta.env.VITE_BACKEND_URL}/api/experience/last-opened/${conversationId}`,
                {},
                { withCredentials: true }
            );

        } catch (error) {
            console.log(
                "UPDATE LAST OPENED ERROR:",
                error.response?.data
            );
        }
    };

    const handleFileSelect = (e) => {
        const newFiles = Array.from(e.target.files || []);

        if (newFiles.length === 0) {
            return;
        }

        setError("");

        setSelectedFiles((previousFiles) => {
            const combinedFiles = [
                ...previousFiles,
                ...newFiles
            ];

            const uniqueFiles = combinedFiles.filter(
                (file, index, array) =>
                    index ===
                    array.findIndex(
                        (item) =>
                            item.name === file.name &&
                            item.size === file.size &&
                            item.lastModified === file.lastModified
                    )
            );

            return uniqueFiles.slice(0, 5);
        });

        e.target.value = "";
    };

    const removeSelectedFile = (indexToRemove) => {
        setSelectedFiles((previousFiles) =>
            previousFiles.filter(
                (_, index) => index !== indexToRemove
            )
        );
    };

    const sendMessage = async () => {
        if (
            (!message.trim() && selectedFiles.length === 0) ||
            isSending ||
            !conversation
        ) {
            return;
        }

        if (conversation.status !== "active") {
            return;
        }

        const currentMessage = message.trim();
        const currentFiles = [...selectedFiles];

        setMessage("");
        setSelectedFiles([]);
        setError("");
        setIsSending(true);

        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }

        const temporaryMessage = {
            id: `temporary-${Date.now()}`,
            sender: "user",
            message: currentMessage || null,
            files: currentFiles.map((file, index) => ({
                id: `temporary-file-${Date.now()}-${index}`,
                file_name: file.name,
                file_path: null,
                resource_type: file.type
            }))
        };

        setMessages((previousMessages) => [
            ...previousMessages,
            temporaryMessage
        ]);

        try {
            const formData = new FormData();

            if (currentMessage) {
                formData.append("message", currentMessage);
            }

            currentFiles.forEach((file) => {
                formData.append("files", file);
            });

            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/experience/${conversationId}/message`,
                formData,
                { withCredentials: true }
            );

            setMessages((previousMessages) => {
                const messagesWithoutTemporary =
                    previousMessages.filter(
                        (item) =>
                            item.id !== temporaryMessage.id
                    );

                return [
                    ...messagesWithoutTemporary,
                    response.data.userMessage,
                    response.data.aiMessage
                ];
            });

        } catch (error) {
            console.log(
                "SEND EXPERIENCE MESSAGE ERROR:",
                error.response?.data
            );

            setMessages((previousMessages) =>
                previousMessages.filter(
                    (item) =>
                        item.id !== temporaryMessage.id
                )
            );

            setMessage(currentMessage);
            setSelectedFiles(currentFiles);

            setError(
                error.response?.data?.message ||
                "Failed to send message"
            );

        } finally {
            setIsSending(false);
        }
    };

    const handleMessageChange = (e) => {
        setMessage(e.target.value);

        e.target.style.height = "auto";
        e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
    };

    const handleMessageKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleScroll = () => {
        const distanceFromBottom =
            document.documentElement.scrollHeight -
            (window.scrollY + window.innerHeight);

        setShowScrollButton(distanceFromBottom > 20);
    };

    const scrollToLatestMessage = () => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    };

    const handleEndConversation = async () => {
    if (!conversation || conversation.status !== "active") {
        return;
    }

    try {
        const response = await axios.patch(
            `${import.meta.env.VITE_BACKEND_URL}/api/experience/close/${conversationId}`,
            {},
            { withCredentials: true }
        );

        setConversation(response.data.conversation);

    } catch (error) {
        console.log(
            "CLOSE EXPERIENCE CONVERSATION ERROR:",
            error.response?.data
        );

        setError(
            error.response?.data?.message ||
            "Failed to end conversation"
        );
    }
};

    const getFileUrl = (filePath) => {
        if (!filePath) {
            return null;
        }

        const normalizedPath = filePath.replace(/\\/g, "/");
        const uploadsIndex = normalizedPath.indexOf("uploads/");

        if (uploadsIndex === -1) {
            return null;
        }

        const relativePath = normalizedPath.substring(
            uploadsIndex
        );

        return `${import.meta.env.VITE_BACKEND_URL}/${relativePath}`;
    };

    const isImageFile = (resourceType) => {
        return resourceType?.startsWith("image/");
    };

    useEffect(() => {
        getExperienceConversation();
        updateLastOpened();
    }, [conversationId]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);

        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        if (!isLoading && messages.length > 0) {
            messagesEndRef.current?.scrollIntoView({
                behavior: "auto"
            });
        }
    }, [isLoading]);

    useEffect(() => {
        if (messages.length > 0) {
            messagesEndRef.current?.scrollIntoView({
                behavior: "smooth"
            });
        }
    }, [messages.length]);

    if (isLoading) {
        return (
            <div className="experience-chat-page">
                <div className="experience-chat-loading">
                    <p className="p">Loading conversation...</p>
                </div>
            </div>
        );
    }

    if (error && !conversation) {
        return (
            <div className="experience-chat-page">
                <div className="experience-chat-error">
                    <p className="p">{error}</p>

                    <button
                        className="secondary-button"
                        type="button"
                        onClick={() =>
                            navigate("/experience-centre")
                        }
                    >
                        Back to Experience Centre
                    </button>
                </div>
            </div>
        );
    }

    if (!conversation) {
        return null;
    }

    const isConversationActive =
        conversation.status === "active";

    const canSend =
        isConversationActive &&
        !isSending &&
        (
            message.trim().length > 0 ||
            selectedFiles.length > 0
        );

    return (
        <div className="experience-chat-page">

            <div
                className={`experience-chat-header ${
                    isHeaderCollapsed
                        ? "experience-chat-header-collapsed"
                        : ""
                }`}
            >

                {!isHeaderCollapsed && (
                    <>
                        <div className="experience-topic-section">

                            <h5 className="h6 experience-topic-title">
                                {conversation.title}
                            </h5>

                            <div className="experience-topic-pills">

                                <div className="experience-topic-pill small experience-topic-pill-projectType">
                                    {
                                        projectTypeLabels[
                                            conversation.project_type?.toLowerCase()
                                        ]
                                    }
                                </div>

                                <div className="experience-topic-pill small experience-topic-pill-domain">
                                    {
                                        domainLabels[
                                            conversation.domain?.toLowerCase()
                                        ]
                                    }
                                </div>

                                <div
                                    className={`experience-topic-pill small ${
                                        conversation.difficulty?.toLowerCase() === "beginner"
                                            ? "experience-topic-pill-difficulty-beginner"
                                            : conversation.difficulty?.toLowerCase() === "intermediate"
                                            ? "experience-topic-pill-difficulty-intermediate"
                                            : "experience-topic-pill-difficulty-advanced"
                                    }`}
                                >
                                    {
                                        difficultyLabels[
                                            conversation.difficulty?.toLowerCase()
                                        ]
                                    }
                                </div>

                            </div>
                        </div>

                        <div className="experience-button-section">

                            <button
                                className="secondary-button"
                                type="button"
                                onClick={() => navigate(-1)}
                            >
                                Back
                            </button>

                            <button
                                className="primary-button"
                                type="button"
                                onClick={handleEndConversation}
                                disabled={!isConversationActive}
                            >
                                {
                                    isConversationActive
                                        ? "End Conversation"
                                        : "Conversation Ended"
                                }
                            </button>

                        </div>
                    </>
                )}

                <button
                    type="button"
                    className={`experience-header-toggle ${
                        isHeaderCollapsed
                            ? "experience-header-toggle-collapsed"
                            : ""
                    }`}
                    onClick={() =>
                        setIsHeaderCollapsed(
                            (previous) => !previous
                        )
                    }
                    aria-label={
                        isHeaderCollapsed
                            ? "Show conversation header"
                            : "Hide conversation header"
                    }
                >
                    <img
                        src={drop_down_arrow_dark}
                        alt=""
                        className={
                            isHeaderCollapsed
                                ? "experience-header-arrow"
                                : "experience-header-arrow experience-header-arrow-up"
                        }
                    />
                </button>

            </div>


            <div className="chat-area">

                <div className="chat-messages">

                    {messages.map((item) => (

                        item.sender === "ai" ? (

                            <div
                                className="ai-message"
                                key={item.id}
                            >
                                <img
                                    src={ai_icon}
                                    alt="AI"
                                    className="ai-message-icon"
                                />

                                <p className="p">
                                    {item.message}
                                </p>
                            </div>

                        ) : (

                            <div
                                className="user-message"
                                key={item.id}
                            >

                                {item.files?.length > 0 && (
                                    <div className="user-message-files">

                                        {item.files.map((file) => {
                                            const fileUrl =
                                                getFileUrl(
                                                    file.file_path
                                                );

                                            return (
                                                <div
                                                    className="chat-file"
                                                    key={file.id}
                                                >

                                                    {fileUrl &&
                                                    isImageFile(
                                                        file.resource_type
                                                    ) ? (
                                                        <a
                                                            href={fileUrl}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="chat-image-link"
                                                        >
                                                            <img
                                                                src={fileUrl}
                                                                alt={file.file_name}
                                                                className="chat-image-preview"
                                                            />
                                                        </a>
                                                    ) : (
                                                        <a
                                                            href={
                                                                fileUrl ||
                                                                undefined
                                                            }
                                                            target={
                                                                fileUrl
                                                                    ? "_blank"
                                                                    : undefined
                                                            }
                                                            rel={
                                                                fileUrl
                                                                    ? "noreferrer"
                                                                    : undefined
                                                            }
                                                            className="chat-file-name"
                                                            onClick={(e) => {
                                                                if (!fileUrl) {
                                                                    e.preventDefault();
                                                                }
                                                            }}
                                                        >
                                                            {file.file_name}
                                                        </a>
                                                    )}

                                                </div>
                                            );
                                        })}

                                    </div>
                                )}

                                {item.message && (
                                    <p className="p">
                                        {item.message}
                                    </p>
                                )}

                            </div>
                        )

                    ))}

                    {isSending && (
                        <div className="ai-message">

                            <img
                                src={ai_icon}
                                alt="AI"
                                className="ai-message-icon"
                            />

                            <p className="p">
                                Thinking...
                            </p>

                        </div>
                    )}

                    <div ref={messagesEndRef}></div>

                </div>


                {error && (
                    <div className="experience-chat-message-error">
                        <p className="small">
                            {error}
                        </p>
                    </div>
                )}


               {isConversationActive ? (
                        <div className="chat-input-container">

                            <div className="chat-input">

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx"
                                    className="chat-file-input"
                                    onChange={handleFileSelect}
                                />

                                <button
                                    type="button"
                                    className="chat-upload-button"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    disabled={
                                        isSending ||
                                        selectedFiles.length >= 5
                                    }
                                    title={
                                        selectedFiles.length >= 5
                                            ? "Maximum 5 files"
                                            : "Upload files"
                                    }
                                >
                                    <img
                                        src={upload_icon}
                                        alt="Upload"
                                    />
                                </button>

                                <div className="chat-text-section">

                                    {selectedFiles.length > 0 && (
                                        <div className="selected-files">

                                            {selectedFiles.map(
                                                (file, index) => (
                                                    <div
                                                        className="selected-file"
                                                        key={`${file.name}-${file.lastModified}-${index}`}
                                                    >
                                                        <span className="small">
                                                            {file.name}
                                                        </span>

                                                        <button
                                                            type="button"
                                                            className="remove-selected-file"
                                                            onClick={() =>
                                                                removeSelectedFile(index)
                                                            }
                                                            disabled={isSending}
                                                            aria-label={`Remove ${file.name}`}
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                )
                                            )}

                                        </div>
                                    )}

                                    <textarea
                                        ref={textareaRef}
                                        className="small chat-text-input"
                                        placeholder="Type and upload here..."
                                        rows="1"
                                        value={message}
                                        onChange={handleMessageChange}
                                        onKeyDown={handleMessageKeyDown}
                                        disabled={isSending}
                                    />

                                </div>

                                <button
                                    type="button"
                                    className="chat-submit-button"
                                    onClick={sendMessage}
                                    disabled={!canSend}
                                >
                                    <img
                                        src={submit_icon}
                                        alt="Submit"
                                    />
                                </button>

                            </div>

                        </div>
                    ) : (
                        <div className="chat-input-container">
                            <div className="chat-ended-message">
                                <p className="p">
                                    This conversation has been ended by user.
                                </p>
                            </div>
                        </div>
                    )}

            </div>


            {showScrollButton && (
                <button
                    type="button"
                    className="chat-scroll-bottom-button"
                    onClick={scrollToLatestMessage}
                    aria-label="Go to latest message"
                >
                    ↓
                </button>
            )}

        </div>
    );
}

export default ExperienceChat;