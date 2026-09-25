import { generateTopicController, saveTopicController , getSavedTopicsController, deleteSavedTopicController, getSingleSavedTopicController} from "../controllers/topicController.js";
import express from "express";
import verifyAuthentication from "../middleware/authMiddleware.js";


const router = express.Router();


router.post("/generate",verifyAuthentication,generateTopicController);
router.post("/save",verifyAuthentication,saveTopicController);
router.get("/get-saved-topics",verifyAuthentication,getSavedTopicsController);
router.delete("/delete-saved-topic/:id",verifyAuthentication,deleteSavedTopicController);
router.get("/get-saved-topic/:id",verifyAuthentication,getSingleSavedTopicController);
export default router;