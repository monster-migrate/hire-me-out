import mongoose, { model } from "mongoose";
import { CandidateSchema } from "./candidates.schema";
import { CandidateInterface } from "./candidates.interface";

export default mongoose.models.Candidate || model<CandidateInterface>("Candidate", CandidateSchema);
