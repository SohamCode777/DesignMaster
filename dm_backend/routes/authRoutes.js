import express from "express";
import { getCurrentUser, loginUser, logoutUser, registerUser, updateUserDetails, changePassword } from "../controllers/authController.js";
import verifyAuthentication from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login",loginUser);
router.get("/me",verifyAuthentication,getCurrentUser);
router.post("/logout", logoutUser);
router.patch("/update-details", verifyAuthentication, updateUserDetails);
router.patch("/change-password", verifyAuthentication, changePassword);

export default router;