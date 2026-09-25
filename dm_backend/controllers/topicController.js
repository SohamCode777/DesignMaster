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


//get saved topics

const getSavedTopicsController = async (req, res) => {
    try {
        const userId = req.userId;

       const savedTopics = await pool.query(
                `SELECT
                    id,
                    title,
                    project_type AS "projectType",
                    domain,
                    client,
                    challenge,
                    deliverables,
                    difficulty,
                    created_at AS "createdAt"
                FROM saved_topics
                WHERE user_id = $1
                ORDER BY created_at DESC`,
                [userId]
            );

        return res.status(200).json({
            topics: savedTopics.rows,
            message: "Saved topics retrieved successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to retrieve saved topics"
        });
    }
};


//delete saved topic

const deleteSavedTopicController = async (req, res) => {
    try {
        const userId = req.userId;
        const topicId = req.params.id;

        const deletedTopic = await pool.query(
            `DELETE FROM saved_topics
             WHERE id = $1 AND user_id = $2
             RETURNING id`,
            [topicId, userId]
        );

        if (deletedTopic.rows.length === 0) {
            return res.status(404).json({
                message: "Saved topic not found"
            });
        }

        return res.status(200).json({
            message: "Saved topic deleted successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to delete saved topic"
        });
    }
};


//get single saved topic

const getSingleSavedTopicController = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;

    try {
        const result = await pool.query(
            `
            SELECT
                id,
                title,
                project_type AS "projectType",
                domain,
                client,
                challenge,
                deliverables,
                difficulty,
                created_at AS "createdAt"
            FROM saved_topics
            WHERE id = $1 AND user_id = $2
            `,
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Topic not found"
            });
        }

        res.status(200).json({
            topic: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to get topic"
        });
    }
};

export {generateTopicController, saveTopicController, getSavedTopicsController, deleteSavedTopicController, getSingleSavedTopicController};