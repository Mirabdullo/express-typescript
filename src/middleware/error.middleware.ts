import {HttpExeption} from "../httpExeption/httpExeption";
import {Request, Response, NextFunction} from "express";


const errorMiddleware = (error: HttpExeption, req: Request, res: Response, next: NextFunction) => {
    try {
        const status: number = error.status || 500
        const message: string = error.message || "Internal server error"
        res.status(status).json({message})
    } catch (e) {
        next(e)
    }
}

export default errorMiddleware;