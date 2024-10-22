"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const Mail_1 = __importDefault(require("./Mail"));
const app = (0, express_1.default)(); //p
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: ["http://localhost:5173", "https://whiteboard-drab.vercel.app"],
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true, // if you need to support cookies
    },
});
const connecteduser = [];
let canvasState = []; // Store the state of the canvas (all lines)
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    // Send the existing canvas state to the newly connected user
    socket.emit('canvasData', canvasState);
    // Listen for drawing events from the client
    socket.on('drawing', (data) => {
        canvasState.push(data); // Store the drawn line in the state
        // Broadcast the drawing event to all other clients
        socket.broadcast.emit('drawing', data);
    });
    socket.on("cursormove", (data) => {
        console.log('Cursor moved:', data);
        socket.broadcast.emit("cursormove", data);
    });
    // Clear canvas on the server and notify all clients
    socket.on('clearCanvas', () => {
        canvasState = []; // Clear the server-side canvas state
        io.emit('canvasCleared'); // Notify all clients to clear their canvases
    });
    // Send an email invitation
    socket.on("invite", (email) => {
        console.log("Email sent to:", email);
        (0, Mail_1.default)(email);
    });
    // Handle chat messages
    socket.on("chat", (data) => {
        console.log("Chat received:", data);
        socket.broadcast.emit("chats", data);
    });
    // Handle user connection and emit active users
    socket.on("checkuser", (data) => {
        // Avoid duplicate users in the connected user list
        const existingUserIndex = connecteduser.findIndex(user => user.id === socket.id);
        if (existingUserIndex === -1) {
            connecteduser.push({ ...data, id: socket.id });
        }
        else {
            // Update user details if necessary
            connecteduser[existingUserIndex] = { ...data, id: socket.id };
        }
        console.log("Active users:", connecteduser);
        io.emit("activeusers", connecteduser); // Emit updated user list to all clients
    });
    // Handle user disconnect and update the connected user list
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
        const userIndex = connecteduser.findIndex(user => user.id === socket.id);
        if (userIndex !== -1) {
            connecteduser.splice(userIndex, 1); // Remove the user from the list
        }
        console.log('Updated users after disconnect:', connecteduser.length);
        io.emit("activeusers", connecteduser); // Emit updated user list to all clients
    });
});
const PORT = process.env.PORT || 1042;
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
