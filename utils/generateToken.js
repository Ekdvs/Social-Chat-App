import jwt from "jsonwebtoken";

export const signJwt = (payload, expiresIn = process.env.JWT_EXPIRES) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

export const verifyJwt = (token) =>
  jwt.verify(token, process.env.JWT_SECRET);
