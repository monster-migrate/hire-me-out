import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../../middleware/db-connect";
import Candidate from "../../../../../mongoose/Candidates/candidates.model";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") return res.status(405).end();

    await dbConnect();

    const { id } = req.query;
    if (!id || typeof id !== "string") {
        return res.status(400).json({ error: "Missing or invalid candidate id" });
    }

    const candidate = await Candidate.findById(id).select("resume");
    if (!candidate || !candidate.resume || !candidate.resume.buffer) {
        return res.status(404).json({ error: "Resume not found" });
    }

    res.setHeader("Content-Type", candidate.resume.mimetype);
    res.setHeader(
        "Content-Disposition",
        `attachment; filename="${candidate.resume.originalname}"`
    );
    res.setHeader("Content-Length", candidate.resume.size);

    // Send the buffer as the response
    res.send(candidate.resume.buffer);
}
