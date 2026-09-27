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

  const [message, setMessage] = useState("");
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const messagesEndRef = useRef(null);

  const fakeConversation = {
    id: 1,
    title: "Reimagining the Complete Digital Banking Experience",
    projectType: "ui-ux-design",
    domain: "finance",
    difficulty: "intermediate",
    client: "Finly",
    challenge: "Create a simpler and more engaging personal finance experience.",
    deliverables: [
      "User Flow",
      "Low-Fidelity Wireframes",
      "High-Fidelity Mobile Screens"
    ],
    status: "active"
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);

    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
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

  useEffect(() => {
    updateLastOpened();
  }, [conversationId]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
                {fakeConversation.title}
              </h5>

              <div className="experience-topic-pills">

                <div className="experience-topic-pill small experience-topic-pill-projectType">
                  {
                    projectTypeLabels[
                      fakeConversation.projectType.toLowerCase()
                    ]
                  }
                </div>

                <div className="experience-topic-pill small experience-topic-pill-domain">
                  {
                    domainLabels[
                      fakeConversation.domain.toLowerCase()
                    ]
                  }
                </div>

                <div
                  className={`experience-topic-pill small ${
                    fakeConversation.difficulty.toLowerCase() === "beginner"
                      ? "experience-topic-pill-difficulty-beginner"
                      : fakeConversation.difficulty.toLowerCase() === "intermediate"
                      ? "experience-topic-pill-difficulty-intermediate"
                      : "experience-topic-pill-difficulty-advanced"
                  }`}
                >
                  {
                    difficultyLabels[
                      fakeConversation.difficulty.toLowerCase()
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
              >
                End Conversation
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
            setIsHeaderCollapsed((previous) => !previous)
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

            <div className="ai-message">
              <img src={ai_icon} alt="AI" className="ai-message-icon" />
              <p className="p">
                Hello! I'm your client for this project. Let's begin by discussing
                the direction you'd like to take for the personal finance experience.
              </p>
            </div>

            <div className="user-message">
              <p className="p">
                I think the experience should feel simple and approachable while
                still giving users enough information to understand their finances.
              </p>
            </div>

            <div className="ai-message">
              <img src={ai_icon} alt="AI" className="ai-message-icon" />
              <p className="p">
                That sounds like a good direction. What do you think is the biggest
                problem users currently face when managing their personal finances?
              </p>
            </div>

            <div className="user-message">
              <p className="p">
                I think there is too much information presented at once. Users can
                see their balance, transactions, investments, bills, and spending
                categories, but it can become difficult to understand what actually
                matters to them.
              </p>
            </div>

            <div className="ai-message">
              <img src={ai_icon} alt="AI" className="ai-message-icon" />
              <p className="p">
                I agree that reducing cognitive load could be important. Let's focus
                on the user flow first. How would you imagine a user moving through
                the experience from opening the app to understanding their finances?
              </p>
            </div>

            <div className="user-message">
              <p className="p">
                The user should probably start with a quick overview of their
                financial health. From there, they could choose to explore spending,
                upcoming bills, savings, or other areas depending on what they need.
              </p>
            </div>

            <div className="user-message">
              <div className="user-message-files">
                <button type="button" className="chat-file-name">
                  homepage-wireframe.png
                </button>
                <button type="button" className="chat-file-name">
                  finance-flow.pdf
                </button>
              </div>

              <p className="p">
                I have attached the initial wireframes and the user flow for you
                to review.
              </p>
            </div>

            <div className="ai-message">
              <img src={ai_icon} alt="AI" className="ai-message-icon" />
              <p className="p">
                Thanks. I have reviewed the direction and the attached materials.
                The overall flow feels clear, but I think we should simplify the
                first screen so users immediately understand their financial status.
              </p>
            </div>

            <div className="user-message">
              <p className="p">
                That makes sense. I was considering showing the total balance first,
                followed by a short summary of spending and upcoming payments.
              </p>
            </div>

            <div className="ai-message">
              <img src={ai_icon} alt="AI" className="ai-message-icon" />
              <p className="p">
                That could work well. We should also consider whether the user needs
                to interact with the summary immediately or simply understand it
                before deciding where to go next.
              </p>
            </div>

            <div className="user-message">
              <p className="p">
                I would prefer the first screen to be mostly informational. The
                important actions could come after the user has understood their
                current financial situation.
              </p>
            </div>

            <div className="ai-message">
              <img src={ai_icon} alt="AI" className="ai-message-icon" />
              <p className="p">
                Good. Let's keep that principle for the user flow. For the next
                iteration, try restructuring the flow around overview, insight,
                and action rather than presenting every feature immediately.
              </p>
            </div>

            <div className="user-message">
              <p className="p">
                I have updated the flow based on that structure. I also moved the
                detailed spending information one level deeper so it doesn't compete
                with the main overview.
              </p>
            </div>

            <div className="ai-message">
              <img src={ai_icon} alt="AI" className="ai-message-icon" />
              <p className="p">
                That is closer to the direction I had in mind. Let's lock the user
                flow for now and move on to the low-fidelity wireframes.
              </p>
            </div>

            <div className="user-message">
              <p className="p">
                Sounds good. I'll start working on the low-fidelity wireframes
                using the updated flow.
              </p>
            </div>

            <div className="ai-message">
              <img src={ai_icon} alt="AI" className="ai-message-icon" />
              <p className="p">
                Great. Once the wireframes are ready, share them here and we'll
                review the structure and hierarchy together.
              </p>
            </div>

            <div ref={messagesEndRef}></div>

          </div>

        <div className="chat-input-container">

          <div className="chat-input">

            <button
              type="button"
              className="chat-upload-button"
            >
              <img
                src={upload_icon}
                alt="Upload"
              />
            </button>

            <textarea
              className="small chat-text-input"
              placeholder="Type and upload here..."
              rows="1"
              value={message}
              onChange={handleMessageChange}
            />

            <button
              type="button"
              className="chat-submit-button"
            >
              <img
                src={submit_icon}
                alt="Submit"
              />
            </button>

          </div>

        </div>

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