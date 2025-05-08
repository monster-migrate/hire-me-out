import mongoose, { model } from "mongoose";
import { UserSchema } from "./user.schema";
import { UserInterface } from "./user.interface";

export default mongoose.models.User || model<UserInterface>("User", UserSchema);
