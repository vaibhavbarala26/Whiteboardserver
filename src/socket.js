"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { express, Express } = require("express");
const http = require("http");
const { Server, Socket } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server);
io.on("connection", (socket) => {
});
