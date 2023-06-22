import express from "express";
import {connect} from 'mongoose'
import {dbConnection} from "./config/dbConnection";
import {Routes} from "./interface/router.interface";
import cors from "cors";
import errorMiddleware from "./middleware/error.middleware";
import swaggerUi from 'swagger-ui-express';
import * as bodyParser from 'body-parser'
import * as fs from 'fs'

class App {
    public app: express.Application;
    public port: number = 3001
    constructor(routes: Routes[]) {
        this.app = express()

        this.connectionToDatabases()
        this.initializeMiddleware()
        this.initializeRoutes(routes)
        this.initializeErrorHendling()
        this.initializeSwagger()
    }

    public listen(){
        this.app.listen(this.port)
        console.log(`Server is running: http://localhost:${this.port}`)
    }

    private async connectionToDatabases():Promise<void>{
        try {
            await connect(dbConnection.url, dbConnection.options)
            console.log('Connected to database')
        } catch (e) {
            console.log(e)
        }
    }

    private initializeMiddleware() {
        this.app.use(cors())
        this.app.use(express.json())
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
        this.app.use(express.static(__dirname + '../../uploads'))
    }

    private initializeRoutes(routes: Routes[]){
        routes.forEach((route: any) => {
            this.app.use('/', route.router)
        })
    }

    private initializeErrorHendling() {
        this.app.use(errorMiddleware)
    }

    private initializeSwagger(){
        const file = fs.readFileSync(__dirname + "/swagger.json", 'utf-8')
        const swaggerDocument = JSON.parse(file)
        this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))
        console.log("Swagger connected");
    }
}

export default App