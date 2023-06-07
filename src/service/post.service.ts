import mongoose from "mongoose";
import postModel from "../model/post.model";
import { PostDto, UpdatePostDto } from "../validateDto/postDto";
import { HttpExeption } from "../httpExeption/httpExeption";
import * as fs from 'fs'


class PostService {
    public posts = postModel

    public async createPost(postDto: PostDto){
        if(!mongoose.Types.ObjectId.isValid(postDto.authorId)){
            throw new HttpExeption(401, "AuthorId wrong")
        }

        const post = await this.posts.create(postDto)
        return post
    }

    public async getPosts(){
        return await this.posts.find()
    }

    public async getPostById(id: string){
        if(!mongoose.Types.ObjectId.isValid(id)){
            throw new HttpExeption(401, "Invalid post id")
        }

        const post = await this.posts.findById({_id: id})
        if(!post){
            throw new HttpExeption(404, "Post not found")
        }

        return post
    }

    public async updatePost(updatePost: UpdatePostDto, id: string){
        if(!mongoose.Types.ObjectId.isValid(id)){
            throw new HttpExeption(401, "Invalid post id")
        }

        const post = await this.posts.findById({_id: id})
        if(!post){
            throw new HttpExeption(404, "Post not found")
        }

        if(updatePost.image){
            if(fs.existsSync(`./uploads/${post.image}`)){
                fs.unlinkSync(`./uploads/${post.image}`)
            }
        }

        await this.posts.updateOne({
            title: updatePost.title || post.title,
            description: updatePost.description || post.description,
            image: updatePost.image || post.image,
            authorId: post.authorId
        })

        return await this.getPostById(id)
    }


    public async deletePost(id:string){
        if(!mongoose.Types.ObjectId.isValid(id)){
            throw new HttpExeption(401, "Invalid post id")
        }

        const post = await this.posts.findById({_id: id})
        if(!post){
            throw new HttpExeption(404, "Post not found")
        }
        if(fs.existsSync(`./uploads/${post.image}`)){
            fs.unlinkSync(`./uploads/${post.image}`)
        }
        await this.posts.deleteOne({_id: id})

        return {message: "Post deleted"}
    }
}

export default PostService