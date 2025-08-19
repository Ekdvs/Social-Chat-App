import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/admin.js";
import { me, updateProfile, followUser, unfollowUser, listUsers, deleteUser } from "../controllers/userController.js";

const router = Router();
router.get("/me", protect, me);
router.put("/me", protect, updateProfile);
router.post("/:id/follow", protect, followUser);
router.post("/:id/unfollow", protect, unfollowUser);

// Admin
router.get("/", protect, requireAdmin, listUsers);
router.delete("/:id", protect, requireAdmin, deleteUser);


export default router;

