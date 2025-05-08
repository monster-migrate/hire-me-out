import mongoose from "mongoose";
declare global {
    var mongoose: mongoose;
}

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
        } & DefaultSession["user"];
    }
}