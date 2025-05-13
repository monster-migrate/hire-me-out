import mongoose, { ObjectId, Types } from "mongoose";
import { UserInterface } from "../User/user.interface";

export enum Status {
    NEW = 'NEW',
    SCHEDULED = 'SCHEDULED',
    ONGOING = 'ONGOING',
    SELECTED = 'SELECTED',
    REJECTED = 'REJECTED'
}
export enum Position {
    DESIGNER = 'DESIGNER',
    DEVELOPER = 'DEVELOPER',
    HUMAN_RESOURCE = 'HUMAN_RESOURCE'
}
export interface CandidateInterface {
    name: string;
    email: string;
    countryCode: string;
    phone: string;
    position: Position;
    Department: string;
    DateOfJoining?: Date;
    status: Status;
    experience: number;
    createdAt: Date;
    hrManagerId: Types.ObjectId;
    image: string;
    updatedAt: Date;
    resume?: {
        buffer: Buffer;
        originalname: string;
        mimetype: string;
        size: number;
    };
}