import Candidate from "./candidates.model";
import { CandidateInterface } from "./candidates.interface";
import { Types } from "mongoose";

export const createCandidate = async (
    data: Omit<CandidateInterface, "createdAt" | "updatedAt">,
    hrManagerId: Types.ObjectId
) => {
    try {
        const existing = await Candidate.findOne({ email: data.email });
        if (existing) throw new Error("Candidate with this email already exists");

        return await Candidate.create({
            ...data,
            hrManager: hrManagerId,
            image: "/assets/profile2.png",
        });
    } catch (error) {
        throw new Error(`Error creating candidate: ${error}`);
    }
};

export const getCandidatesByHR = async (
    hrManagerId: Types.ObjectId,
    status?: string,
    position?: string
) => {
    try {
        const filter: any = { hrManager: hrManagerId };
        if (status) {
            filter.status = status;
        }
        if (position) {
            filter.position = position;
        }

        const candidates = await Candidate.find(filter).sort({ createdAt: -1 });
        return candidates;
    } catch (error) {
        throw new Error(`Error fetching candidates for HR: ${error}`);
    }
};

export const getCandidateByIDForHR = async (
    candidateId: string,
    hrManagerId: Types.ObjectId
) => {
    try {
        return await Candidate.findOne({
            _id: candidateId,
            hrManager: hrManagerId,
        });
    } catch (error) {
        throw new Error(`Error fetching candidate: ${error}`);
    }
};

export const updateCandidateForHR = async (
    candidateId: Types.ObjectId,
    hrManagerId: Types.ObjectId,
    data: Partial<CandidateInterface>
) => {
    try {
        const candidate = await Candidate.findByIdAndUpdate(
            candidateId,
            { $set: data },
            { new: true }
        );

        if (!candidate) throw new Error("Candidate not found or unauthorized");

        Object.assign(candidate, data);
        await candidate.save();
        return candidate;
    } catch (error) {
        throw new Error(`Error updating candidate: ${error}`);
    }
};

export const deleteCandidateForHR = async (
    candidateId: string,
    hrManagerId: Types.ObjectId
): Promise<boolean> => {
    try {
        const result = await Candidate.deleteOne({
            _id: candidateId,
            hrManager: hrManagerId,
        });
        return result.deletedCount > 0;
    } catch (error) {
        throw new Error(`Error deleting candidate: ${error}`);
    }
};

export const uploadResume = async (
    candidateId: Types.ObjectId,
    resume: Express.Multer.File
): Promise<boolean> => {
    if (!resume) throw new Error("File not uploaded");
    const resumeData = {
        buffer: Buffer,
        encoding: resume.mimetype,
        originalname: resume.originalname,
        size: resume.size,
    }
    const candidate = await Candidate.findByIdAndUpdate(
        candidateId,
        { resume: resumeData },
        { new: true }
    );
    if (!candidate) throw new Error("Candidate not found");

    return true;
}
