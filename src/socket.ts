import { Socket } from "socket.io";
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import main from "./Mail";

const app = express(); //p
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "https://whiteboard-drab.vercel.app"],
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true, // if you need to support cookies
    },
});

interface Userdata {
    name: string;
    email: string;
    id: string; // This corresponds to socket.id
}

const connecteduser: Userdata[] = [];

interface LineData {
    color: string;
    points: Array<{ x: number; y: number }>;
    tool: string;
    width: number;
}

interface Cursor {
    x: number;
    y: number;
    id: string;
    color?: string; // Optional property
}

interface Chats {
    name: string;
    message: string;
    email?: string; // This should be a string instead of an array
}

let canvasState: LineData[] = []; // Store the state of the canvas (all lines)

io.on('connection', (socket: Socket) => {
    console.log('A user connected:', socket.id);

    // Send the existing canvas state to the newly connected user
    socket.emit('canvasData', canvasState);

    // Listen for drawing events from the client
    socket.on('drawing', (data: LineData) => {
        canvasState.push(data); // Store the drawn line in the state
        // Broadcast the drawing event to all other clients
        socket.broadcast.emit('drawing', data);
    });

    socket.on("cursormove", (data: Cursor) => {
        console.log('Cursor moved:', data);
        socket.broadcast.emit("cursormove", data);
    });

    // Clear canvas on the server and notify all clients
    socket.on('clearCanvas', () => {
        canvasState = []; // Clear the server-side canvas state
        io.emit('canvasCleared'); // Notify all clients to clear their canvases
    });

    // Send an email invitation
    socket.on("invite", (email: string) => {
        console.log("Email sent to:", email);
        main(email);
    });

    // Handle chat messages
    socket.on("chat", (data: Chats) => {
        console.log("Chat received:", data);
        socket.broadcast.emit("chats", data);
    });

    // Handle user connection and emit active users
    socket.on("checkuser", (data: Userdata) => {
        // Avoid duplicate users in the connected user list
        const existingUserIndex = connecteduser.findIndex(user => user.id === socket.id);
        if (existingUserIndex === -1) {
            connecteduser.push({ ...data, id: socket.id });
        } else {
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
