import User from "../models/UserModel.js";
import OtpToken from "../models/OtpToken.js";
import { signJwt } from "../utils/generateToken.js";
import { sendMail } from "../configs/mailer.js";

const makeOtp = () => Math.floor(100000 + Math.random() * 900000).toString();
const addMinutes = (d, m) => new Date(d.getTime() + m * 60000);

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  const exists = await User.findOne({ $or: [{ email }, { username }] });
  if (exists) return res.status(409).json({ message: "User already exists" });

  const user = await User.create({ username, email, password });
  const otp = makeOtp();
  await OtpToken.create({
    user: user._id,
    otp,
    purpose: "VERIFY_EMAIL",
    expiresAt: addMinutes(new Date(), 10),
  });

  await sendMail({
    to: user.email,
    subject: "Verify your email",
    html: `<p>Your OTP: <b>${otp}</b> (expires in 10 minutes)</p>`,
  });

  res.status(201).json({ message: "Registered. OTP sent to email." });
};

export const verifyEmail = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const rec = await OtpToken.findOne({
    user: user._id,
    purpose: "VERIFY_EMAIL",
    otp,
    expiresAt: { $gt: new Date() },
  });

  if (!rec) return res.status(400).json({ message: "Invalid or expired OTP" });

  user.isVerified = true;
  await user.save();
  await OtpToken.deleteMany({ user: user._id, purpose: "VERIFY_EMAIL" });

  const token = signJwt({ id: user._id });
  res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
  res.json({ message: "Email verified", user });
};

export const login = async (req, res) => {
  const { emailOrUsername, password } = req.body;
  const user = await User.findOne({
    $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
  });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const ok = await user.comparePassword(password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = signJwt({ id: user._id });
  res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
  res.json({ message: "Logged in", user: { ...user.toObject(), password: undefined } });
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const otp = makeOtp();
  await OtpToken.create({
    user: user._id,
    otp,
    purpose: "RESET_PASSWORD",
    expiresAt: addMinutes(new Date(), 10),
  });

  await sendMail({
    to: user.email,
    subject: "Reset password OTP",
    html: `<p>Your reset OTP: <b>${otp}</b></p>`,
  });

  res.json({ message: "OTP sent" });
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const rec = await OtpToken.findOne({
    user: user._id,
    purpose: "RESET_PASSWORD",
    otp,
    expiresAt: { $gt: new Date() },
  });

  if (!rec) return res.status(400).json({ message: "Invalid or expired OTP" });

  user.password = newPassword;
  await user.save();
  await OtpToken.deleteMany({ user: user._id, purpose: "RESET_PASSWORD" });

  res.json({ message: "Password updated" });
};
