import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { createPost, feed, likePost, unlikePost, addComment, sharePost } from "../controllers/postController.js";

const router = Router();
router.get("/feed", protect, feed);
router.post("/", protect, createPost);
router.post("/:id/like", protect, likePost);
router.post("/:id/unlike", protect, unlikePost);
router.post("/:id/comment", protect, addComment);
router.post("/:id/share", protect, sharePost);

export default router;
