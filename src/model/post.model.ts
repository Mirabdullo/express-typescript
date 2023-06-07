import mongoose, { Document, Schema, model } from "mongoose";
import { IPost } from "../interface/postInterface";

const postSchema: Schema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        image: {
            type: String
        },
        authorId: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true
        },
    },
    {
        timestamps: true
    }
)

const postModel = model<IPost & Document>("Post", postSchema)

export default postModel