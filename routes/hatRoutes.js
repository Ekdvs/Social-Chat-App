import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { accessOrCreateOneToOne, createGroup, renameGroup, addToGroup, removeFromGroup, myChats } from "../controllers/chatController.js";

const router = Router();
router.get("/", protect, myChats);
router.post("/access", protect, accessOrCreateOneToOne);
router.post("/group", protect, createGroup);
router.put("/:id/rename", protect, renameGroup);
router.put("/:id/add", protect, addToGroup);
router.put("/:id/remove", protect, removeFromGroup);

export default router;
