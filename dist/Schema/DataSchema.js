"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Define LineData schema
const LineDataSchema = new mongoose_1.Schema({
    color: { type: String, required: true },
    points: [
        {
            x: { type: Number, required: true },
            y: { type: Number, required: true },
        },
    ],
    tool: { type: String, required: true },
    width: { type: Number, required: true },
});
// Define RoomwiseLinedata schema
const RoomwiseLinedataSchema = new mongoose_1.Schema({
    roomname: { type: String, required: true },
    roomdata: [LineDataSchema], // Array of LineData
});
// Create Mongoose models
const RoomwiseLinedataModel = mongoose_1.default.model("RoomwiseLinedata", RoomwiseLinedataSchema);
exports.default = RoomwiseLinedataModel;
