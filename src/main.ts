import express, { Express, Request, Response } from "express";
import * as dotenv from 'dotenv';
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;



app.listen(port, () => {
    console.log(`Server is running: http://localhost:${port}`);
});