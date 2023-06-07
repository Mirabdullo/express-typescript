import mongoose from "mongoose"
import { Document } from "mongoose"

export interface IPost extends Document {
    title: string
    description: string
    image: string
    authorId: mongoose.Types.ObjectId
}