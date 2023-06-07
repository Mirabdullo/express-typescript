import { Router } from "express"
import PostController from "../controller/post.controller"
import FileUploadService from "../service/file.upload.service"


class PostRouter {
    public path: string = '/post'
    public router: Router = Router()
    public postController = new PostController() 
    public fileUploadService = new FileUploadService()


    constructor(){
        this.initializeRoutes()
    }

    public initializeRoutes() {
        this.router.post(`${this.path}`, this.fileUploadService.uploadSingleFile('file'), this.postController.createPostController)
        this.router.get(`${this.path}`, this.postController.getPosts)
        this.router.get(`${this.path}/:id`, this.postController.getPostsById)
        this.router.put(`${this.path}/:id`, this.fileUploadService.uploadSingleFile('file'), this.postController.updatePost)
        this.router.delete(`${this.path}/:id`, this.postController.deletePost)
    }
}


export default PostRouter