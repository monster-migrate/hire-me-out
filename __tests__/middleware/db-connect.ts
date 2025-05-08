import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });
/**
 * @jest-environment node
 */
import dbConnect from "../../middleware/db-connect";
import mongoose from "mongoose";

describe("dbConnect (MongoDB Atlas)", () => {
    afterEach(async () => {
        jest.clearAllMocks();
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
    });

    afterAll(async () => {
        jest.restoreAllMocks();
    });

    test("connects to MongoDB Atlas", async () => {
        await dbConnect();
        expect(mongoose.connection.readyState).toBe(1); // 1 = connected
    }, 50000);

    test("disconnects from MongoDB Atlas", async () => {
        await dbConnect();
        await mongoose.disconnect();
        expect(mongoose.connection.readyState).toBe(0); // 0 = disconnected
    });
    it('returns true', () => {
        expect(true).toBe(true);
    })
});
