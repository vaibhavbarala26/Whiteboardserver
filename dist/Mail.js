"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: 'gmail', // Automatically sets host and port for Gmail
    auth: {
        user: "golu260204@gmail.com", // Your Gmail address
        pass: "lqaa vcve shbt gttb", // Your Gmail app password
    },
    tls: {
        rejectUnauthorized: false // Allows self-signed certificates (not recommended for production)
    }
});
// Async function to send the email
async function main(email) {
    try {
        // Send mail with defined transport object
        const info = await transporter.sendMail({
            from: "golu260204@gmail.com", // Sender address
            to: email, // Recipient email
            subject: "Join the whiteboard session", // Subject line
            text: "Click the link to join the whiteboard session", // Plain text body
            html: "<p>Click on the following link to join the session:</p><a href='http://localhost:5173/'>Join Whiteboard Session</a>", // HTML body
        });
        console.log("Message sent: %s", info.messageId, email);
    }
    catch (error) {
        console.error("Error sending email:", error);
    }
}
// Export the main function
exports.default = main;
