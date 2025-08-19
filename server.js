import express from 'express'
import connectDB from './configs/db.js'
import dotenv from 'dotenv'
import http from "http";
import app from "./app.js";
import { initIO } from "./sockets/io.js";








//conectthe database 
const start = async () => {
  await connectDB();
  const server = http.createServer(app);
  initIO(server);
  const port = process.env.PORT || 5000;
  server.listen(port, () => console.log(`🚀 Server running on http://localhost:${port}`));
};

start();
