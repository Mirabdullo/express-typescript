import {Router} from "express";
import UserController from "../controller/user.controller";

class UserRouter {
    public path: string = "/user"
    public router: Router = Router()
    public userController = new UserController()

    constructor() {
        this.initializeRoutes()
    }

    public initializeRoutes(){
        this.router.post(`${this.path}`, this.userController.createUserController)
        this.router.post(`${this.path}/login`, this.userController.loginUserController)
        /**
        * @swagger
        * tags:
        *   name: Users
        *   description: User management
            
        * /users:
        *   get:
        *     summary: Get all users
        *     tags: [Users]
        *     responses:
        *       200:
        *         description: OK
        */
        this.router.get(`${this.path}`, this.userController.getUserController)
        this.router.get(`${this.path}/:id`, this.userController.getUserByIdController)
        this.router.put(`${this.path}/:id`, this.userController.updateUserController)
        this.router.delete(`${this.path}/:id`, this.userController.deleteUserController)
    }
}

export default UserRouter