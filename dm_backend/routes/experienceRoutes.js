import express from "express";
import verifyAuthentication from "../middleware/authMiddleware.js";
import {
    createExperienceConversationController,
    getExperienceConversationsController,
    updateLastOpenedController,
    getRecentlyOpenedController,
    closeExperienceConversationController,
    deleteExperienceConversationController
} from "../controllers/experienceController.js";



const router = express.Router();

router.post("/create-conversation",verifyAuthentication,createExperienceConversationController);
router.get("/get-conversations",verifyAuthentication,getExperienceConversationsController);
router.patch("/last-opened/:conversationId",verifyAuthentication,updateLastOpenedController);
router.get("/recently-opened",verifyAuthentication,getRecentlyOpenedController);
router.patch( "/close/:conversationId",verifyAuthentication, closeExperienceConversationController);
router.delete( "/delete/:conversationId",verifyAuthentication,deleteExperienceConversationController);

export default router;