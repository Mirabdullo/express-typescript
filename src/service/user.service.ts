import UserModel from "../model/user.model";
import {LoginDto, userCreateDto} from "../validateDto/userDto";
import {HttpExeption} from "../httpExeption/httpExeption";
import {compare, hash} from "bcrypt";
import { userUpdateDto } from "../validateDto/userDto";
import mongoose from "mongoose";
import * as jwt from 'jsonwebtoken'


class UserService {
    public users = UserModel

    public async getUsers(){
        return await this.users.find().exec()
    }

    public async createUser(userDto: userCreateDto){
        const user = await this.users.findOne({username: userDto.username})
        if(user){
            throw new HttpExeption(401, "User already exists")
        }
        const hashedPassword = await hash(userDto.password,7)
        const newUser = await this.users.create({
            fullname: userDto.fullname,
            username: userDto.username,
            password: hashedPassword
        })

        const payload = {
            id: newUser._id,
            username: newUser.username
        }
        const accessToken = jwt.sign(payload, process.env.SECRET_KEY || "SECRET_KEY", {
            expiresIn: '2d'
        })


        return {
            ...newUser,
            access_token: accessToken
        }
    }


    public async loginUser(loginDto: LoginDto){
        const user = await this.users.findOne({username: loginDto.username })
        if(!user){
            throw new HttpExeption(401, "User not authorized")
        }

        const comparePassword = compare(loginDto.password, user.password)
        if(!comparePassword){
            throw new HttpExeption(401, "Password invalid")
        }
        const payload = {
            id: user._id,
            username: user.username
        }
        const accessToken = jwt.sign(payload, process.env.SECRET_KEY || "SECRET_KEY", {
            expiresIn: '2d'
        })

        return {
            access_token: accessToken
        }
    }


    public async getUserById(id:string){
        if(!mongoose.Types.ObjectId.isValid(id)){
            throw new HttpExeption(404, "Invalid id")
        }
        const user = await this.users.findById({_id: id}).exec()
        if(!user){
            throw new HttpExeption(404, "User not found")
        }
        return user
    }

    public async putUserById(updateUserDto: userUpdateDto,id:string){
        if(!mongoose.Types.ObjectId.isValid(id)){
            throw new HttpExeption(404, "Invalid id")
        }
        const user = await this.users.findById({_id: id}).exec()
        if(!user) {
            throw new HttpExeption(404, "User not found")
        }

        if(await this.users.findOne({username: updateUserDto.username})){
            throw new HttpExeption(404, "This username already exists")
        }

        const updateUser = await this.users.updateOne({_id: id}, {
            fullname: updateUserDto.fullname || user.fullname,
            username: updateUserDto.username || user.username,
            password: updateUserDto.password || user.password
        }, {new: true})

        return await this.getUserById(id)
    }


    public async deleteUser(id:string){
        if(!mongoose.Types.ObjectId.isValid(id)){
            throw new HttpExeption(404, "Invalid id")
        }
        const user = await this.users.findById({_id: id}).exec()
        if(!user) {
            throw new HttpExeption(404, "User not found")
        }

        await this.users.deleteOne({_id: id})
        return {
            message: "User deleted"
        }
    }

    
}

export default UserService