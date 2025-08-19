import Notification from "../models/NotificationModel.js";

export const listNotifications = async (req, res) => {
  const items = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate("actor", "username avatar")
    .populate("post", "_id image");
  res.json(items);
};

export const markRead = async (req, res) => {
  await Notification.updateMany({ user: req.user._id, read: false }, { $set: { read: true } });
  res.json({ message: "All read" });
};
