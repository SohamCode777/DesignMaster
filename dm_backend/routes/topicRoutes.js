import { generateTopicController, saveTopicController } from "../controllers/topicController.js";
import express from "express";
import verifyAuthentication from "../middleware/authMiddleware.js";


const router = express.Router();


router.post("/generate",verifyAuthentication,generateTopicController);
router.post("/save",verifyAuthentication,saveTopicController);

export default router;