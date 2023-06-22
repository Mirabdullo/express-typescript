import UserModel from "../model/user.model";
import {LoginDto, userCreateDto} from "../validateDto/userDto";
import {HttpExeption} from "../httpExeption/httpExeption";
import {compare, hash} from "bcrypt";
import { userUpdateDto } from "../validateDto/userDto";
import mongoose from "mongoose";
import * as jwt from 'jsonwebtoken'
import XLSX from 'xlsx';
import path from "path";
import { Request, Response } from "express";
import * as ExcelJS from 'exceljs'
import ObjectsToCsv from 'objects-to-csv'
import { parse } from 'json2csv'
import * as fs from 'fs';

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
            newUser,
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

    public async getUserTOExel(){

        const data = await this.users.find().lean()
        console.log(data);

        // Convert data to an array of objects with only the required fields
        const formattedData = data.map(item => {
          return {
            Fullname: item.fullname,
            username: item.username,
            // Add more fields as needed
          };
        });
    
        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    
        const excelFilePath = '/home/mirabdulloh/Documents/express_typescript/uploads/file.xlsx';
        // Replace with the path where you want to save the Excel file
        console.log(workbook, excelFilePath);
        XLSX.writeFile(workbook, excelFilePath);
    
        return excelFilePath
    }

    public async getUsersInFormatCSV(res: Response, req: Request) {
        const fields = ["fullname", "username"];
        const opts = { fields };
        const users = await this.users.find(
          {},
          { _id: 0, password: 0, __v: 0, createdAt: 0, updatedAt: 0 }
        );
    
        let csv = parse(users, opts);
        fs.writeFile(
          __dirname + "/../../files/" + "users.csv",
          csv,
          function (err) {
            if (err) throw err;
            console.log("writed successfully");
          }
        );
        return "/users.csv";
      }
    
      public async getUsersInFormatExcel(res: Response, req: Request) {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Users");
    
        // Fetch users from the database
        const users = await this.users.find(
          {},
          { _id: 0, password: 0, __v: 0, createdAt: 0, updatedAt: 0 }
        );
    
        // Define the columns
        sheet.columns = [
          { header: "Full Name", key: "fullname" },
          { header: "Username", key: "username" },
          // Add more columns as needed
        ];
    
        // Add data to the worksheet
        users.forEach((user) => {
          sheet.addRow({ fullname: user.fullname, username: user.username });
        });
    
        // Generate a buffer for writing the workbook data
        const buffer = await workbook.xlsx.writeBuffer();
    
        // Set the response headers for downloading the file
        res.setHeader("Content-Disposition", 'attachment; filename="users.xlsx"');
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
    
        // Write the buffer to the response object
        res.write(buffer);
        res.end();
      }
    
      public async getUsersFormatCSV(req: Request, res: Response) {
        const users = await this.users.find(
          {},
          { _id: 0, password: 0, __v: 0, createdAt: 0, updatedAt: 0 }
        );
    
        // Convert users data to an array of objects
        const usersData = users.map((user) => ({
          fullname: user.fullname,
          username: user.username,
          // Add more fields as needed
        }));
    
        // Create a new instance of ObjectsToCsv
        const csv = new ObjectsToCsv(usersData);
    
        // Generate the CSV data
        const csvData = await csv.toString();
    
        // Set the response headers for downloading the file
        res.setHeader("Content-Disposition", 'attachment; filename="users.csv"');
        res.setHeader("Content-Type", "text/csv");
    
        // Write the CSV data to the response
        res.send(csvData);
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

        await this.users.updateOne({_id: id}, {
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