import User from "../models/UserModel.js";
import Notification from "../models/NotificationModel.js";

export const me = async (req, res) => res.json(req.user);

export const updateProfile = async (req, res) => {
  const { bio, avatar } = req.body;
  const user = await User.findByIdAndUpdate(req.user._id, { bio, avatar }, { new: true });
  res.json(user);
};

export const followUser = async (req, res) => {
  const { id } = req.params; // target user
  if (String(id) === String(req.user._id)) return res.status(400).json({ message: "Cannot follow yourself" });

  const target = await User.findById(id);
  if (!target) return res.status(404).json({ message: "User not found" });

  await User.updateOne({ _id: req.user._id }, { $addToSet: { following: target._id } });
  await User.updateOne({ _id: target._id }, { $addToSet: { followers: req.user._id } });

  await Notification.create({ user: target._id, actor: req.user._id, type: "FOLLOW" });

  res.json({ message: "Followed" });
};

export const unfollowUser = async (req, res) => {
  const { id } = req.params;
  const target = await User.findById(id);
  if (!target) return res.status(404).json({ message: "User not found" });

  await User.updateOne({ _id: req.user._id }, { $pull: { following: target._id } });
  await User.updateOne({ _id: target._id }, { $pull: { followers: req.user._id } });

  res.json({ message: "Unfollowed" });
};

// Admin examples
export const listUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

export const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
};
