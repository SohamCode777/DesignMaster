import { generateTopic } from "../services/ai/topicGenerator.js";
import pool from "../config/db.js";

const generateTopicController = async (req, res) =>{
      try {
        const { projectType, domain, difficulty, suggestions } = req.body;

        if (!projectType || !domain || !difficulty) {
            return res.status(400).json({
                message: "Project type, domain and difficulty are required"
            });
        }

        // console.log({
        //     projectType,
        //     domain,
        //     difficulty,
        //     suggestions
        // });

        const topic = await generateTopic({
            projectType,
            domain,
            difficulty,
            suggestions
        });

        return res.status(200).json({
            topic: topic,
            message: "Topic created successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to generate topic"
        });
    }
};



//Save Topic

const saveTopicController = async (req, res) => {
    try {
        const userId = req.userId;
        const { topic } = req.body;

       if(!topic){
        return res.status(400).json({
                message: "Topic is required"
            });
       }


       const savedTopic = await pool.query(
        `INSERT INTO saved_topics
        (user_id, title, project_type, domain, client, challenge, deliverables, difficulty)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id`,
        [
            userId,
            topic.title,
            topic.projectType,
            topic.domain,
            topic.client,
            topic.challenge,
            topic.deliverables,
            topic.difficulty
        ]
    );


        return res.status(201).json({
            message: "Topic saved successfully",
            topicId: savedTopic.rows[0].id
        });



    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to save topic"
        });
    }
};


export {generateTopicController, saveTopicController};