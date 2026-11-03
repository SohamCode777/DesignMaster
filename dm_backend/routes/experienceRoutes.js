import express from "express";

import verifyAuthentication from "../middleware/authMiddleware.js";
import experienceUpload from "../middleware/experienceUploadMiddleware.js";

import {
    createExperienceConversationController,
    getExperienceConversationsController,
    getExperienceConversationController,
    sendExperienceMessageController,
    updateLastOpenedController,
    getRecentlyOpenedController,
    closeExperienceConversationController,
    deleteExperienceConversationController
} from "../controllers/experienceController.js";

const router = express.Router();

router.post(
    "/create-conversation",
    verifyAuthentication,
    createExperienceConversationController
);

router.get(
    "/get-conversations",
    verifyAuthentication,
    getExperienceConversationsController
);

router.patch(
    "/last-opened/:conversationId",
    verifyAuthentication,
    updateLastOpenedController
);

router.get(
    "/recently-opened",
    verifyAuthentication,
    getRecentlyOpenedController
);

router.patch(
    "/close/:conversationId",
    verifyAuthentication,
    closeExperienceConversationController
);

router.delete(
    "/delete/:conversationId",
    verifyAuthentication,
    deleteExperienceConversationController
);

/*
 * These generic conversation routes are placed after
 * the named routes above.
 */

router.get(
    "/:conversationId",
    verifyAuthentication,
    getExperienceConversationController
);

router.post(
    "/:conversationId/message",
    verifyAuthentication,
    experienceUpload,
    sendExperienceMessageController
);

export default router;