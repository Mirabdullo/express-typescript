import {Schema, model, Document} from "mongoose";
import {IUser} from "../interface/userInterface";

const userSchema: Schema = new Schema(
    {
        fullname: {
            type: String
        },
        username: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)
const userModel = model<IUser & Document>("User", userSchema)

export default userModel