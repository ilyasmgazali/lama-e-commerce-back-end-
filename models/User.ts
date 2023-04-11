// import mongoose from "mongoose";

// const UserSchema = new mongoose.Schema(
//     {
//         username: { type: String, required: true, unique: true },
//         email: { type: String, required: true, unique: true },
//         password: { type: String, required: true, unique: true },
//         isAdmin: {
//             type: Boolean,
//             default: false,
//         },
//     },
//     { timestamps: true }
// );

// const userModel = mongoose.model("User, UserSchema");
// export { userModel };

import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    isAdmin: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema: Schema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isAdmin: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const UserModel: Model<IUser> = mongoose.model<IUser>("User", userSchema); //maybe with string???

export default UserModel;
