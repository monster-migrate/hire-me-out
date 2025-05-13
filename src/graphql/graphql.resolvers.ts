import { GraphQLError } from "graphql";
import { getUserByEmail, getAllUsers, createUser, updateUser, deleteUser, getUserByID } from "../../mongoose/User/user.service";
import bcrypt from "bcryptjs";
import { createCandidate, deleteCandidateForHR, getCandidateByIDForHR, getCandidatesByHR, updateCandidateForHR } from "../../mongoose/Candidates/candidates.service";
import { Types } from "mongoose";
import { Status } from "../../mongoose/Candidates/candidates.interface";
import { GraphQLDate } from "./graphqlDate";

export const resolvers = {
    GraphQLDate: GraphQLDate,
    Query: {
        getUser: async (_: any, { email }: { email: string }) => {
            const user = await getUserByEmail(email);
            if (!user) throw new Error("User not found");
            return user;
        },
        getUsers: async () => await getAllUsers(),
        getUserByID: async (_: any, { id }: { id: string }) => {
            const user = await getUserByID(id);
            if (!user) throw new Error("User not found");
            return user;
        },
        getCandidatesByHR: async (
            _: any,
            { hrManagerId, status, position }: { hrManagerId: Types.ObjectId; status?: string; position?: string; }
        ) => {
            return await getCandidatesByHR(hrManagerId, status, position);
        },
        getCandidateByID: async (_: any, { id, hrManagerId }: { id: string, hrManagerId: Types.ObjectId }) => {
            return await getCandidateByIDForHR(id, hrManagerId);
        },
    },
    Mutation: {
        createUser: async (
            _: any,
            {
                name,
                email,
                password,
            }: { name: string; email: string; password: string; }
        ) => {
            try {
                const saltRounds = 10;
                const salt = bcrypt.genSaltSync(saltRounds);
                const hashedPassword = bcrypt.hashSync(password, salt);

                const document = {
                    name,
                    email,
                    password: hashedPassword,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };

                const success = await createUser(document);
                return {
                    id: success._id.toString(),
                    name,
                    email,
                    createdAt: document.createdAt,
                    updatedAt: document.updatedAt,
                };
            } catch (err: any) {
                throw new GraphQLError("Validation Error", {
                    extensions: {
                        code: "BAD_USER_INPUT",
                        exception: {
                            errors: {
                                email: err.message,
                            },
                        },
                    },
                });
            }
        },
        updateUser: async (
            _: any,
            {
                name,
                email,
                password,
            }: { name?: string; email: string; password?: string }
        ) => {
            const updateData = {
                ...(name && { name }),
                ...(email && { email }),
                ...(password && { password }),
                updatedAt: new Date(),
            };
            const updatedUser = await updateUser(email, updateData);
            if (!updatedUser) {
                throw new Error("Failed to update user");
            }

            return updatedUser;
        },
        deleteUser: async (_: any, { email }: { email: string }) => {
            const user = await getUserByEmail(email);
            if (!user) {
                throw new Error("User not found");
            }
            console.log(user);
            const success = await deleteUser({ email });
            if (!success) {
                throw new Error("Failed to delete user");
            }
            return user;
        },
        authenticateUser: async (_: any, { email, password }: { email: string; password: string }) => {
            const user = await getUserByEmail(email);
            if (!user) throw new Error("User not found");

            const isValid = await bcrypt.compare(password, user?.password);
            if (!isValid) throw new Error("Invalid credentials");

            return {
                id: user._id || null,
                name: user.name,
                email: user.email,
            };
        },
        createCandidate: async (_: any, { _id, name, email, countryCode, phone, position, Department, DateOfJoining, status, experience, image, hrManagerId }: any) => {
            const newCandidateData = {
                _id,
                name,
                email,
                countryCode,
                phone,
                position,
                Department,
                DateOfJoining: DateOfJoining ? new Date(DateOfJoining) : undefined,
                status: Status[status as keyof typeof Status],
                experience,
                image,
                hrManagerId,
            };
            const newCandidate = await createCandidate(newCandidateData, hrManagerId);
            return newCandidate;
        },
        updateCandidate: async (
            _: any,
            {
                id,
                name,
                email,
                countryCode,
                phone,
                position,
                Department,
                DateOfJoining,
                status,
                experience,
                image,
                hrManagerId
            }: any
        ) => {
            const updateData = {
                name,
                email,
                countryCode,
                phone,
                position,
                Department,
                DateOfJoining,
                status,
                experience,
                image,
                hrManagerId
            };
            // Remove undefined fields
            Object.keys(updateData).forEach(
                (key) => (updateData as any)[key] === undefined && delete (updateData as any)[key]
            );

            return await updateCandidateForHR(id, hrManagerId, updateData);
        },
        deleteCandidate: async (_: any, { id, hrManagerId }: { id: string, hrManagerId: Types.ObjectId }) => {
            return await deleteCandidateForHR(id, hrManagerId);
        },
    }
}