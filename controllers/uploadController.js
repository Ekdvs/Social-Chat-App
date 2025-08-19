import cloudinary from "../configs/cloudinary.js";
import streamifier from "streamifier";

const uploadStream = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

export const uploadImage = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file" });
  const result = await uploadStream(req.file.buffer, "inxcode-app");
  res.status(201).json({ url: result.secure_url, public_id: result.public_id });
};

