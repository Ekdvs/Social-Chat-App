import Post from "../models/postModel.js";
import Comment from "../models/CommentModel.js";
import Notification from "../models/NotificationModel.js";

export const createPost = async (req, res) => {
  const { caption, image } = req.body; // image = cloudinary URL
  const post = await Post.create({ user: req.user._id, caption, image });
  res.status(201).json(post);
};

export const feed = async (req, res) => {
  const ids = [req.user._id, ...req.user.following];
  const posts = await Post.find({ user: { $in: ids } })
    .sort({ createdAt: -1 })
    .populate("user", "username avatar")
    .lean();
  res.json(posts);
};

export const likePost = async (req, res) => {
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  );
  if (!post) return res.status(404).json({ message: "Post not found" });
  if (String(post.user) !== String(req.user._id)) {
    await Notification.create({ user: post.user, actor: req.user._id, type: "LIKE", post: post._id });
  }
  res.json(post);
};

export const unlikePost = async (req, res) => {
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true }
  );
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json(post);
};

export const addComment = async (req, res) => {
  const { text } = req.body;
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const comment = await Comment.create({ user: req.user._id, post: post._id, text });
  await Notification.create({ user: post.user, actor: req.user._id, type: "COMMENT", post: post._id });

  res.status(201).json(comment);
};

export const sharePost = async (req, res) => {
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { $inc: { shareCount: 1 } },
    { new: true }
  );
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json({ message: "Shared", post });
};
