import { NextFunction, Request, Response } from "express";
import PostService from "../service/post.service";
import { HttpExeption } from "../httpExeption/httpExeption";
import FileUploadService from "../service/file.upload.service";
import { PostDto, UpdatePostDto } from "../validateDto/postDto";


class PostController {
    public postService = new PostService()
    public fileUploadService = new FileUploadService()

    public createPostController = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.fileUploadService.hendleFileUpload(req)
            const post: PostDto = req.body
            if(result){
                post.image = result
            }
            res.json(await this.postService.createPost(post))
        } catch (error:any) {
            console.log(error);
            next(new HttpExeption(error.status, error.message))
        }
    }

    public getPosts = async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.json(await this.postService.getPosts())
        } catch (error:any) {
            console.log(error);
            next(new HttpExeption(error.status, error.message))
        }
    }

    public getPostsById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id
            res.json(await this.postService.getPostById(id))
        } catch (error: any) {
            console.log(error);
            next(new HttpExeption(error.status, error.message))
        }
    }

    public updatePost = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.fileUploadService.hendleFileUpload(req)
            const post: UpdatePostDto = req.body
            const id = req.params.id
            if(result){
                post.image = result
            }

            res.json(await this.postService.updatePost(post,id))
        } catch (error: any) {
            console.log(error);
            next(new HttpExeption(error.status, error.message))
        }
    }

}

export default PostController