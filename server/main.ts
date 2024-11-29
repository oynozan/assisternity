require("dotenv").config();

import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import express, { type Application } from "express";

import routes from "./routes";
import { initializeSocket } from "./socket";

mongoose.connect(process.env.MONGO_URI!); // MongoDB

const app: Application = express();
const server = require("http").createServer(app);

/* Middlewares */
const whitelist = [process.env.CLIENT_URL!];
if (process.env.NODE_ENV == "development")
    whitelist.push("http://localhost:3000");

app.use(cors({ origin: whitelist, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/", routes);

// Socket
initializeSocket(server, whitelist);

// Start the server
server.listen(process.env.PORT, () =>
    console.log(`Assisternity Server is running on port ${process.env.PORT}`)
);