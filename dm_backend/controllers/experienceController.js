import pool from "../config/db.js";

import {
    generateClientPersona,
    generateExperienceResponse
} from "../services/ai/experienceChat.js";


const createExperienceConversationController = async (req, res) => {
    try {
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

        const userId = req.userId;

            const existingConversation = await pool.query(
                `
                SELECT id
                FROM experience_conversations
                WHERE user_id = $1
                AND topic_id = $2
                AND status = 'active'
                LIMIT 1
                `,
                [userId, topicId]
            );

        if (existingConversation.rows.length > 0) {
            return res.status(400).json({
                message: "An experience conversation already exists for this topic."
            });
        }

        const previousPersonasResult = await pool.query(
            `
            SELECT client_persona
            FROM experience_conversations
            WHERE user_id = $1
              AND client_persona IS NOT NULL
            ORDER BY created_at DESC
            LIMIT 20
            `,
            [userId]
        );

        const previousPersonas = previousPersonasResult.rows
            .map((row) => row.client_persona)
            .filter(Boolean);

        const clientPersona = await generateClientPersona({
            client,
            projectType,
            domain,
            difficulty,
            previousPersonas
        });

        const conversationResult = await pool.query(
            `
            INSERT INTO experience_conversations (
                user_id,
                topic_id,
                title,
                project_type,
                domain,
                client,
                challenge,
                deliverables,
                difficulty,
                status,
                client_persona
            )
            VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, 'active', $10
            )
            RETURNING *
            `,
            [
                userId,
                topicId,
                title,
                projectType,
                domain,
                client,
                challenge,
                deliverables,
                difficulty,
                JSON.stringify(clientPersona)
            ]
        );

        const conversation = conversationResult.rows[0];

        res.status(201).json({
            message: "Experience conversation created successfully.",
            conversation
        });
    } catch (error) {
        console.error("Create experience conversation error:", error);

        res.status(500).json({
            message: "Failed to create experience conversation."
        });
    }
};


const getExperienceConversationsController = async (req, res) => {
    try {
        const userId = req.userId;

        const result = await pool.query(
            `
            SELECT *
            FROM experience_conversations
            WHERE user_id = $1
            ORDER BY created_at DESC
            `,
            [userId]
        );

        res.status(200).json({
            conversations: result.rows
        });
    } catch (error) {
        console.error("Get experience conversations error:", error);

        res.status(500).json({
            message: "Failed to get experience conversations."
        });
    }
};


const getExperienceConversationController = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.userId;

        const conversationResult = await pool.query(
            `
            SELECT *
            FROM experience_conversations
            WHERE id = $1
              AND user_id = $2
            `,
            [conversationId, userId]
        );

        if (conversationResult.rows.length === 0) {
            return res.status(404).json({
                message: "Experience conversation not found."
            });
        }

        const conversation = conversationResult.rows[0];

        const messagesResult = await pool.query(
            `
            SELECT *
            FROM experience_messages
            WHERE conversation_id = $1
            ORDER BY created_at ASC
            `,
            [conversationId]
        );

        const filesResult = await pool.query(
            `
            SELECT *
            FROM experience_files
            WHERE conversation_id = $1
            ORDER BY created_at ASC
            `,
            [conversationId]
        );

        const messages = messagesResult.rows.map((message) => ({
            ...message,
            files: filesResult.rows.filter(
                (file) => file.message_id === message.id
            )
        }));

        if (messages.length === 0) {
            const greeting = await generateExperienceResponse({
                conversation,
                messages: [
                    {
                        sender: "user",
                        message: "Start the client simulation."
                    }
                ],
                files: []
            });

            const greetingResult = await pool.query(
                `
                INSERT INTO experience_messages (
                    conversation_id,
                    sender,
                    message
                )
                VALUES ($1, 'ai', $2)
                RETURNING *
                `,
                [conversationId, greeting]
            );

            messages.push({
                ...greetingResult.rows[0],
                files: []
            });
        }

        res.status(200).json({
            conversation,
            messages
        });
    } catch (error) {
        console.error("Get experience conversation error:", error);

        res.status(500).json({
            message: "Failed to get experience conversation."
        });
    }
};


const sendExperienceMessageController = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.userId;

        const message = req.body.message?.trim() || "";
        const files = req.files || [];

        if (!message && files.length === 0) {
            return res.status(400).json({
                message: "Message or file is required."
            });
        }

        const conversationResult = await pool.query(
            `
            SELECT *
            FROM experience_conversations
            WHERE id = $1
              AND user_id = $2
            `,
            [conversationId, userId]
        );

        if (conversationResult.rows.length === 0) {
            return res.status(404).json({
                message: "Experience conversation not found."
            });
        }

        const conversation = conversationResult.rows[0];

        if (conversation.status === "closed") {
            return res.status(400).json({
                message: "This experience conversation is closed."
            });
        }

        const userMessageResult = await pool.query(
            `
            INSERT INTO experience_messages (
                conversation_id,
                sender,
                message
            )
            VALUES ($1, 'user', $2)
            RETURNING *
            `,
            [
                conversationId,
                message || null
            ]
        );

        const userMessage = userMessageResult.rows[0];

        const savedFiles = [];

        for (const file of files) {
            const fileResult = await pool.query(
                `
                INSERT INTO experience_files (
                    conversation_id,
                    message_id,
                    file_name,
                    file_path,
                    resource_type
                )
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *
                `,
                [
                    conversationId,
                    userMessage.id,
                    file.originalname,
                    file.path,
                    file.mimetype
                ]
            );

            savedFiles.push(fileResult.rows[0]);
        }

        const historyResult = await pool.query(
            `
            SELECT sender, message
            FROM experience_messages
            WHERE conversation_id = $1
            ORDER BY created_at ASC
            `,
            [conversationId]
        );

        const aiResponse = await generateExperienceResponse({
            conversation,
            messages: historyResult.rows,
            files
        });

        const aiMessageResult = await pool.query(
            `
            INSERT INTO experience_messages (
                conversation_id,
                sender,
                message
            )
            VALUES ($1, 'ai', $2)
            RETURNING *
            `,
            [conversationId, aiResponse]
        );

        await pool.query(
            `
            UPDATE experience_conversations
            SET
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            `,
            [conversationId]
        );

        res.status(200).json({
            userMessage: {
                ...userMessage,
                files: savedFiles
            },
            aiMessage: {
                ...aiMessageResult.rows[0],
                files: []
            }
        });
    } catch (error) {
        console.error("Send experience message error:", error);

        res.status(500).json({
            message: "Failed to send experience message."
        });
    }
};


const updateLastOpenedController = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.userId;

        const result = await pool.query(
            `
            UPDATE experience_conversations
            SET last_opened_at = CURRENT_TIMESTAMP
            WHERE id = $1
              AND user_id = $2
            RETURNING *
            `,
            [conversationId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Experience conversation not found."
            });
        }

        res.status(200).json({
            message: "Last opened time updated.",
            conversation: result.rows[0]
        });
    } catch (error) {
        console.error("Update last opened error:", error);

        res.status(500).json({
            message: "Failed to update last opened time."
        });
    }
};


const getRecentlyOpenedController = async (req, res) => {
    try {
        const userId = req.userId;

        const result = await pool.query(
            `
            SELECT *
            FROM experience_conversations
            WHERE user_id = $1
              AND last_opened_at IS NOT NULL
            ORDER BY last_opened_at DESC
            LIMIT 3
            `,
            [userId]
        );

        res.status(200).json({
            conversations: result.rows
        });
    } catch (error) {
        console.error("Get recently opened conversations error:", error);

        res.status(500).json({
            message: "Failed to get recently opened conversations."
        });
    }
};


const closeExperienceConversationController = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.userId;

        const conversationResult = await pool.query(
            `
            SELECT *
            FROM experience_conversations
            WHERE id = $1
              AND user_id = $2
            `,
            [conversationId, userId]
        );

        if (conversationResult.rows.length === 0) {
            return res.status(404).json({
                message: "Experience conversation not found."
            });
        }

        const conversation = conversationResult.rows[0];

        if (conversation.status === "closed") {
            return res.status(400).json({
                message: "This conversation has already been closed."
            });
        }

        const result = await pool.query(
            `
            UPDATE experience_conversations
            SET
                status = 'closed',
                ended_at = CURRENT_TIMESTAMP,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
              AND user_id = $2
            RETURNING *
            `,
            [conversationId, userId]
        );

        res.status(200).json({
            message: "Experience conversation closed.",
            conversation: result.rows[0]
        });

    } catch (error) {
        console.error("Close experience conversation error:", error);

        res.status(500).json({
            message: "Failed to close experience conversation."
        });
    }
};

const deleteExperienceConversationController = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.userId;

        const result = await pool.query(
            `
            DELETE FROM experience_conversations
            WHERE id = $1
              AND user_id = $2
            RETURNING id
            `,
            [conversationId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Experience conversation not found."
            });
        }

        res.status(200).json({
            message: "Experience conversation deleted successfully."
        });
    } catch (error) {
        console.error("Delete experience conversation error:", error);

        res.status(500).json({
            message: "Failed to delete experience conversation."
        });
    }
};


export {
    createExperienceConversationController,
    getExperienceConversationsController,
    getExperienceConversationController,
    sendExperienceMessageController,
    updateLastOpenedController,
    getRecentlyOpenedController,
    closeExperienceConversationController,
    deleteExperienceConversationController
};