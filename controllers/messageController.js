import Message from "../models/MessageModel.js";
import Chat from "../models/ChatModel.js";

export const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;
  let message = await Message.create({
    sender: req.user._id,
    content,
    chat: chatId,
  });
  message = await message.populate("sender", "username avatar");
  await Chat.findByIdAndUpdate(chatId, { latestMessage: message._id });
  res.status(201).json(message);
};

export const getMessages = async (req, res) => {
  const { chatId } = req.params;
  const list = await Message.find({ chat: chatId })
    .sort({ createdAt: 1 })
    .populate("sender", "username avatar");
  res.json(list);
};

export const markSeen = async (req, res) => {
  const { chatId } = req.params;
  await Message.updateMany({ chat: chatId }, { $addToSet: { readBy: req.user._id } });
  res.json({ message: "Marked as seen" });
};
