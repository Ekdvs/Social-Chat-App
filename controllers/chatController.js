import Chat from "../models/ChatModel.js";
import Message from "../models/MessageModel.js";

export const accessOrCreateOneToOne = async (req, res) => {
  const { userId } = req.body; // other participant
  let chat = await Chat.findOne({
    isGroupChat: false,
    users: { $all: [req.user._id, userId], $size: 2 },
  }).populate("users", "username avatar");

  if (!chat) {
    chat = await Chat.create({
      isGroupChat: false,
      users: [req.user._id, userId],
    });
    chat = await chat.populate("users", "username avatar");
  }
  res.json(chat);
};

export const createGroup = async (req, res) => {
  const { chatName, users } = req.body; // users: [ids]
  const chat = await Chat.create({
    chatName,
    isGroupChat: true,
    users: [req.user._id, ...users],
    groupAdmin: req.user._id,
  });
  res.status(201).json(await chat.populate("users", "username avatar"));
};

export const renameGroup = async (req, res) => {
  const chat = await Chat.findByIdAndUpdate(
    req.params.id,
    { chatName: req.body.chatName },
    { new: true }
  ).populate("users", "username avatar");
  res.json(chat);
};

export const addToGroup = async (req, res) => {
  const chat = await Chat.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { users: req.body.userId } },
    { new: true }
  ).populate("users", "username avatar");
  res.json(chat);
};

export const removeFromGroup = async (req, res) => {
  const chat = await Chat.findByIdAndUpdate(
    req.params.id,
    { $pull: { users: req.body.userId } },
    { new: true }
  ).populate("users", "username avatar");
  res.json(chat);
};

export const myChats = async (req, res) => {
  const chats = await Chat.find({ users: req.user._id })
    .populate("users", "username avatar")
    .populate({ path: "latestMessage", populate: { path: "sender", select: "username avatar" } })
    .sort({ updatedAt: -1 });
  res.json(chats);
};
