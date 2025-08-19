import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { sendMessage, getMessages, markSeen } from "../controllers/messageController.js";

const router = Router();
router.get("/:chatId", protect, getMessages);
router.post("/", protect, sendMessage);
router.post("/:chatId/seen", protect, markSeen);

export default router;
