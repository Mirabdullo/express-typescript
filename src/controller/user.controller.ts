import UserService from "../service/user.service";
import {NextFunction, Request, Response} from "express";
import {LoginDto, userCreateDto, userUpdateDto} from "../validateDto/userDto";
import {HttpExeption} from "../httpExeption/httpExeption";

class UserController {
    public userService = new UserService()

    public getUserController = async (req: Request, res: Response, next: NextFunction) =>{
        try {
            res.json(await this.userService.getUsers())
        } catch (e: any) {
            console.log(e)
            next(new HttpExeption(e.status, e.message))
        }
    }

    public createUserController = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userDto: userCreateDto = req.body
            res.json(await this.userService.createUser(userDto))
        } catch (e:any) {
            console.log(e)
            next(new HttpExeption(e.status, e.message))
        }
    }

    public loginUserController = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user: LoginDto = req.body
            res.json(await this.userService.loginUser(user))
        } catch (error: any) {
            console.log(error);
            next(new HttpExeption(error.status, error.message))
        }
    }


    public getUserByIdController = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id
            res.json(await this.userService.getUserById(id))
        } catch (error: any) {
            console.log(error);
            next(new HttpExeption(error.status, error.message))
        }
    }

    public updateUserController = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user: userUpdateDto = req.body
            const id = req.params.id
            res.json(await this.userService.putUserById( req.body, id))
        } catch (error: any) {
            console.log(error);
            next(new HttpExeption(error.status, error.message))
        }
    }

    public deleteUserController =async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id
            res.json(await this.userService.deleteUser(id))
        } catch (error: any) {
            console.log(error);
            next(new HttpExeption(error.status, error.message))
        }
    }



}
export default UserController