import User from "./user.model";
import { UserInterface } from "./user.interface";

export const createUser = async (data: UserInterface) => {
    try {
        return await User.create(data);
    } catch (error) {
        throw new Error(`Error creating user: ${error}`);
    }
};
export const getAllUsers = async () => {
    try {
        return await User.find({});
    } catch (error) {
        throw new Error(`Error getting all users: ${error}`);
    }
};
export const getUserByEmail = async (email: string) => {
    try {
        const user = await User.findOne({ email });
        console.log(user);
        return user;
    } catch (error) {
        throw new Error(`Error fetching user: ${error}`);
    }
};
export const getUserByID = async (id: string) => {
    try {
        const user = await User.findById(id);
        return user;
    } catch (error) {
        throw new Error(`Error fetching user: ${error}`);
    }
}

export const updateUser = async (
    email: string,
    data: Partial<UserInterface>
) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }
        Object.assign(user, data);
        console.log(user);
        await user.save();
        return { ...user.toObject(), ...data };
    } catch (error) {
        throw new Error(`Error updating user: ${error}`);
    }
};

export const deleteUser = async ({
    email,
}: {
    email: string;
}): Promise<boolean> => {
    try {
        await User.deleteOne({ email: email });
        return true;
    } catch (error) {
        throw new Error(`Error deleting user: ${error}`);
    }
};
