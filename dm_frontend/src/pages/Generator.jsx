import React from 'react';
import"../App.css";
import "./Generator.css";
import axios from "axios";
import { useState } from 'react';
import design_master_bot_1 from "../assets/design_master_bot_1.svg";
import { projectTypeLabels,domainLabels, difficultyLabels } from '../assets/labels.js';
import { toast } from "react-toastify";


function Generator() {

  const [topic, setTopic] = useState(null);
  const [topicLoading, setTopicLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);


//   const [topic, setTopic] = useState({
//     title: "Design a Personal Finance App for Young Adults",
//     projectType: "UI/UX Design",
//     domain:"Finance",
//     client: "Finly, a personal finance app for young professionals.",
//     challenge: "Finly wants to make it easier for users to understand their spending habits and manage their monthly budgets through a simple, intuitive mobile experience.",
//     deliverables: [
//     "User Research",
//     "Competitor Analysis",
//     "User Personas",
//     "User Journey Map",
//     "Information Architecture",
//     "User Flow",
//     "Wireframes",
//     "Low-Fidelity Prototype",
//     "Design System",
//     "Visual Style Guide",
//     "High-Fidelity Screens",
//     "Interactive Prototype",
//     "Responsive Design",
//     "Usability Testing",
//     "Developer Handoff"
// ],
//     difficulty: "Intermediate"
// });




  const onGenerateHandler = async (e) => {
    e.preventDefault();

   

    const formData = new FormData(e.target);
    const projectType = formData.get("projectType");
    const domain = formData.get("domain");
    const difficulty = formData.get("difficulty");
    const suggestions = formData.get("suggestions");


    try {
      setIsSaved(false);
      setTopic(null);
      setTopicLoading(true);

      
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/topic/generate`,
            {
                projectType,
                domain,
                difficulty,
                suggestions
            },
            { withCredentials: true }
        );

        console.log(response.data);
        setTopic(response.data.topic);

    } catch (error) {
        console.log(error.response?.data);

         toast.error(
            error.response?.data?.message || "Failed to generate topic"
        );
    } finally {
        setTopicLoading(false);
    }
};


const handleSave = async () => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/topic/save`,
            { topic },
            { withCredentials: true }
        );

        console.log(response.data);

        setIsSaved(true);
        toast.success("Topic saved successfully");

    } catch (error) {
        console.log(error.response?.data);

        toast.error(
            error.response?.data?.message || "Failed to save topic"
        );
    }
};


  return (
    <div className='body-container'>
      <div className='generator-container'>

        <div className='heading-and-form'>
          <h1 className='h1 generator-heading'>DESIGN TOPIC GENERATOR</h1>
          <h5 className='h5 generator-sub-heading'>GET YOUR NEXT INSPIRATION HERE!</h5>

          <div className='generator-form'>

            <form id='generator-form-section' className='generator-form-section' onSubmit={onGenerateHandler}  onReset={() => {setTopic(null); setIsSaved(false)}}>

              <div className='project-types-section'>
                <label className=' h6 input-title '>Project Type: </label>
                  <select className='p project-type-input-field' id="project-type" name="projectType">
                        <option value="">Select project type</option>
                        <option value="ui-ux-design">UI/UX Design</option>
                        <option value="web-design">Web Design</option>
                        <option value="brand-identity">Brand Identity</option>
                        <option value="poster-design">Poster Design</option>
                        <option value="social-media-design">Social Media Design</option>
                        <option value="packaging-design">Packaging Design</option>
                        <option value="advertising-campaign-design">Advertising &amp; Campaign Design</option>
                        <option value="presentation-design">Presentation Design</option>
                    </select>
              </div>



              <div className="domain-section">
                    <label className="h6 input-title">Domain:</label>

                    <div className="domain-pills">
                        <label className="domain-pill small">
                            <input type="radio" name="domain" value="technology" />
                            <span>Technology</span>
                        </label>

                        <label className="domain-pill small">
                            <input type="radio" name="domain" value="finance" />
                            <span>Finance</span>
                        </label>

                        <label className="domain-pill small">
                            <input type="radio" name="domain" value="healthcare" />
                            <span>Healthcare</span>
                        </label>

                        <label className="domain-pill small">
                            <input type="radio" name="domain" value="education" />
                            <span>Education</span>
                        </label>

                        <label className="domain-pill small">
                            <input type="radio" name="domain" value="food-lifestyle" />
                            <span>Food &amp; Lifestyle</span>
                        </label>

                        <label className="domain-pill small">
                            <input type="radio" name="domain" value="entertainment" />
                            <span>Entertainment</span>
                        </label>
                    </div>
                </div>



                <div className="difficulty-section">
                    <label className="h6 input-title">Difficulty:</label>

                    <div className="difficulty-pills">
                        <label className=" small difficulty-pill beginner ">
                            <input type="radio" name="difficulty" value="beginner" />
                            <span>Beginner</span>
                        </label>

                        <label className=" small difficulty-pill intermediate ">
                            <input type="radio" name="difficulty" value="intermediate" />
                            <span>Intermediate</span>
                        </label>

                        <label className=" small difficulty-pill advanced ">
                            <input type="radio" name="difficulty" value="advanced" />
                            <span>Advanced</span>
                        </label>
                    </div>
                </div>


                <div className="suggestions-section">
                      <label className="h6 input-title" htmlFor="suggestions">
                          Suggestions (optional):
                      </label>

                      <textarea
                          className=" small suggestions-textarea"
                          id="suggestions"
                          name="suggestions"
                          placeholder="Add any context, suggestions or preferences..."
                      />
                  </div>





            </form>

          </div>
        </div>

        <div className='buttons-and-topic-area'>
          <div className='button-section'>
            <button className='secondary-button p' type="reset" form='generator-form-section'>Reset</button>
            <button className="primary-button p " type="submit" form='generator-form-section'>Generate</button>
          </div>

          <div className='topic-area'>
              {
                topic ? 
                (
                <div className='topic-box'>

                  <div className='save-simulate'>
                    
                    <div className='save-simulate-buttons'>
                     <button className="small secondary-button simulate-size" type="button"
                          onClick={handleSave}
                          disabled={isSaved}
                      >
                          {isSaved ? "Saved" : "Save"}
                      </button>

                      <button className='small primary-button simulate-size' type="submit">Simulate</button>
                    </div>
                    
                  </div>

                  <div className='topic-details'>
                    <div className='topic-section'>
                       <h4 className='h4 topic-title'>{topic.title}</h4>
                       <div className='topic-pills'>
                        <div className='topic-pill small topic-pill-projectType'>{projectTypeLabels[topic.projectType.toLowerCase()]}</div>
                        <div className='topic-pill small topic-pill-domain'> {domainLabels[topic.domain.toLowerCase()]}</div>
                       <div className={`topic-pill small ${
                              topic.difficulty.toLowerCase() === "beginner"
                                  ? "topic-pill-difficulty-beginner"
                                  : topic.difficulty.toLowerCase() === "intermediate"
                                  ? "topic-pill-difficulty-intermediate"
                                  : "topic-pill-difficulty-advanced"
                          }`}>
                              {difficultyLabels[topic.difficulty.toLowerCase()]}
                          </div>
                        </div>
                    </div>
                   

                    <div className='topic-section'>
                      <h6 className='h6 topic-section-title'>Client</h6>
                      <p className='p topic-section-text'>{topic.client}</p>
                    </div>

                     <div className='topic-section'>
                      <h6 className='h6 topic-section-title'>Challenge</h6>
                      <p className='p topic-section-text'>{topic.challenge}</p>
                    </div>

                    <div className='topic-section'>
                      <h6 className='h6 topic-section-title'>Deliverables</h6>

                        <ul className="topic-section-text">
                              {topic.deliverables.map((deliverable, index) => (
                                  <li className="p" key={index}>
                                      {deliverable}
                                  </li>
                              ))}
                          </ul>
                     
                    </div>
                    

                  </div>

                </div>)
                :
                (<div className='generate-ideas'>

                  <img className='dm-bot-image' src={design_master_bot_1} alt="Design Master Bot" />
                  <h4 className='h4 text-area-phrase'>{topicLoading? "Generating Your Topic...": "Get Your Ideas Here!"}</h4>


                </div>)
              }



          </div>
        </div>

      </div>

    </div>
  )
}

export default Generator