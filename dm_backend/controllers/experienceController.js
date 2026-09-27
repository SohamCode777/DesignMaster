import pool from "../config/db.js";


const createExperienceConversationController = async (req, res) => {
    try {
        const userId = req.userId;

        const {
            topicId,
            title,
            projectType,
            domain,
            client,
            challenge,
            deliverables,
            difficulty
        } = req.body;

        // Check if this exact topic has already been simulated
        const existingConversation = await pool.query(
            `SELECT id
             FROM experience_conversations
             WHERE user_id = $1
               AND title = $2
               AND project_type = $3
               AND domain = $4
               AND client = $5
               AND challenge = $6
               AND deliverables = $7
               AND difficulty = $8
             LIMIT 1`,
            [
                userId,
                title,
                projectType,
                domain,
                client,
                challenge,
                deliverables,
                difficulty
            ]
        );

        if (existingConversation.rows.length > 0) {
            return res.status(200).json({
                message: "Topic already simulated",
                alreadySimulated: true,
                conversationId: existingConversation.rows[0].id
            });
        }

        // Create new experience conversation
        const result = await pool.query(
            `INSERT INTO experience_conversations
                (
                    user_id,
                    topic_id,
                    title,
                    project_type,
                    domain,
                    client,
                    challenge,
                    deliverables,
                    difficulty
                )
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
             RETURNING id`,
            [
                userId,
                topicId,
                title,
                projectType,
                domain,
                client,
                challenge,
                deliverables,
                difficulty
            ]
        );

        res.status(201).json({
            message: "Experience conversation created successfully",
            alreadySimulated: false,
            conversationId: result.rows[0].id
        });

    } catch (error) {
        console.log("CREATE EXPERIENCE CONVERSATION ERROR:", error);

        res.status(500).json({
            message: "Failed to create experience conversation"
        });
    }
};


// fetching all experience topics

const getExperienceConversationsController = async (req, res) => {
    try {
        const userId = req.userId;

        const result = await pool.query(
            `SELECT
                id,
                topic_id,
                title,
                project_type,
                domain,
                client,
                challenge,
                deliverables,
                difficulty,
                status,
                created_at,
                updated_at,
                ended_at,
                last_opened_at
             FROM experience_conversations
             WHERE user_id = $1
             ORDER BY created_at DESC`,
            [userId]
        );

        res.status(200).json({
            conversations: result.rows
        });

    } catch (error) {
        console.log("GET EXPERIENCE CONVERSATIONS ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch experience conversations"
        });
    }
};


// Updating last opened conversation

const updateLastOpenedController = async (req, res) => {
    try {
        const userId = req.userId;
        const { conversationId } = req.params;

        const result = await pool.query(
            `UPDATE experience_conversations
             SET last_opened_at = CURRENT_TIMESTAMP
             WHERE id = $1
               AND user_id = $2
             RETURNING id`,
            [conversationId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Conversation not found"
            });
        }

        res.status(200).json({
            message: "Conversation opened successfully"
        });

    } catch (error) {
        console.log("UPDATE LAST OPENED ERROR:", error);

        res.status(500).json({
            message: "Failed to update conversation"
        });
    }
};



const getRecentlyOpenedController = async (req, res) => {
    try {
        const userId = req.userId;

        const result = await pool.query(
            `SELECT
                id,
                topic_id,
                title,
                project_type,
                domain,
                client,
                challenge,
                deliverables,
                difficulty,
                status,
                created_at,
                updated_at,
                ended_at,
                last_opened_at
             FROM experience_conversations
             WHERE user_id = $1
               AND last_opened_at IS NOT NULL
             ORDER BY last_opened_at DESC
             LIMIT 3`,
            [userId]
        );

        res.status(200).json({
            conversations: result.rows
        });

    } catch (error) {
        console.log("GET RECENTLY OPENED ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch recently opened conversations"
        });
    }
};


const closeExperienceConversationController = async (req, res) => {
    try {
        const userId = req.userId;
        const { conversationId } = req.params;

        const result = await pool.query(
            `UPDATE experience_conversations
             SET status = 'closed',
                 ended_at = CURRENT_TIMESTAMP,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $1
               AND user_id = $2
               AND status = 'active'
             RETURNING id`,
            [conversationId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Active conversation not found"
            });
        }

        res.status(200).json({
            message: "Conversation closed successfully"
        });

    } catch (error) {
        console.log("CLOSE EXPERIENCE CONVERSATION ERROR:", error);

        res.status(500).json({
            message: "Failed to close conversation"
        });
    }
};


const deleteExperienceConversationController = async (req, res) => {
    try {
        const userId = req.userId;
        const { conversationId } = req.params;

        const result = await pool.query(
            `DELETE FROM experience_conversations
             WHERE id = $1
               AND user_id = $2
             RETURNING id`,
            [conversationId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Conversation not found"
            });
        }

        res.status(200).json({
            message: "Conversation deleted successfully"
        });

    } catch (error) {
        console.log("DELETE EXPERIENCE CONVERSATION ERROR:", error);

        res.status(500).json({
            message: "Failed to delete conversation"
        });
    }
};



export {createExperienceConversationController,getExperienceConversationsController, updateLastOpenedController,
        getRecentlyOpenedController, closeExperienceConversationController, deleteExperienceConversationController};