import mongoose from "mongoose"

export interface IPost {
    title: string
    description: string
    image: string
    authorId: mongoose.Types.ObjectId
}