import { getUserByEmail, getAllUsers, createUser, updateUser, deleteUser, getUserByID } from "../../mongoose/User/user.service";
import bcrypt from "bcryptjs";
export const resolvers = {
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
        }
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
            console.log(document);
            const success = await createUser(document);
            if (!success) {
                throw new Error("Failed to create user");
            }
            return {
                id: success._id.toString(),
                name,
                email,
                createdAt: document.createdAt,
                updatedAt: document.updatedAt,
            };;
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
        }
    }
}