import { NextFunction, Request, Response } from 'express'
import multer, {Multer} from 'multer'
import * as fs from 'fs'
import path from 'path'
import * as stream from 'stream'

class FileUploadService{
    private upload: Multer

    constructor(){
        this.upload = multer({
            storage: multer.memoryStorage(),
            limits: {
                fileSize: 10 * 1024 * 1024   //10MB limits
            }
        })
    }


    public uploadSingleFile = (fieldName: string) => {
        return this.upload.single(fieldName)
    }

    public hendleFileUpload = async (req: Request) => {
        const file = req.file
        if(file){
   
            
            const uploadDir = './uploads'
            if(!fs.existsSync(uploadDir)){
                fs.mkdirSync(uploadDir)
            }
            console.log(file);
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const fieldname = file.mimetype.split('/')[0]
            const fileName = fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
            
            const filePath = path.join(uploadDir, fileName)
            const writeStream = fs.createWriteStream(filePath)
            const readable = new stream.Readable()
            readable._read = () => {}
            
            readable.push(file.buffer)
            readable.push(null)
            
            readable.pipe(writeStream)
            
            return file.originalname
        }
    }
}

export default FileUploadService