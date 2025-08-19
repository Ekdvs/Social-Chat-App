import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { listNotifications, markRead } from "../controllers/notificationController.js";

const router = Router();
router.get("/", protect, listNotifications);
router.post("/read", protect, markRead);

export default router;
