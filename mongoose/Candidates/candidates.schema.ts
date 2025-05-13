import mongoose, { Types } from "mongoose";
import { Position, Status } from "./candidates.interface";

export const CandidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    countryCode: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    position: {
        type: String,
        enum: Object.values(Position)
    },
    Department: {
        type: String,
        required: true,
    },
    DateOfJoining: {
        type: Date,
        required: false,
    },
    status: {
        type: String,
        enum: Object.values(Status),
        default: Status.NEW,
    },
    experience: {
        type: Number,
        required: false,
    },
    image: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    hrManager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    resume: {
        buffer: Buffer,
        originalname: String,
        mimetype: String,
        size: Number,
    },
},
    { timestamps: true }
);