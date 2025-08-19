import { Router } from "express";
import multer from "multer";
import { protect } from "../middleware/auth.js";
import { uploadImage } from "../controllers/uploadController.js";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

const router = Router();
router.post("/image", protect, upload.single("image"), uploadImage);

export default router;
