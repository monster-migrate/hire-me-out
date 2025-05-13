import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import multer from "multer";
import clientPromise from "@/lib/mongodb/mongodb";
import { ObjectId } from "mongodb";

export const config = {
    api: {
        bodyParser: false,
    },
};

const storage = multer.memoryStorage();
const upload = multer({ storage });

function runMiddleware(
    req: NextApiRequest, res: NextApiResponse, fn: Function) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result: any) => {
            return result instanceof Error ? reject(result) : resolve(result);
        });
    });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end();

    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ error: "Not authenticated" });

    await runMiddleware(req, res, upload.single("resume"));

    const { candidateId } = req.body;
    const file = (req as any).file;

    if (!candidateId || !file) {
        return res.status(400).json({ error: "Missing candidateId or resume file" });
    }

    try {
        const client = await clientPromise;
        const db = client.db();

        await db.collection("candidates").updateOne(
            { _id: new ObjectId(candidateId) },
            {
                $set: {
                    resume: {
                        originalname: file.originalname,
                        mimetype: file.mimetype,
                        size: file.size,
                        buffer: file.buffer,
                    },
                },
            }
        );

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error("Upload error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}
