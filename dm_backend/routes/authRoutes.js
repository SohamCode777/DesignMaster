import express from "express";
import { getCurrentUser, loginUser, logoutUser, registerUser } from "../controllers/authController.js";
import verifyAuthentication from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login",loginUser);
router.get("/me",verifyAuthentication,getCurrentUser);
router.post("/logout", logoutUser);

export default router;