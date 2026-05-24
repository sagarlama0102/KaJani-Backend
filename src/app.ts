import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { connectDatabase } from './database/mongodb';
import { PORT } from './config';
import cors from "cors";
import admin from "firebase-admin";
import * as serviceAccount from "../firebase-service-account.json";
import path from 'path';
import { HttpError } from './errors/http-error';


dotenv.config();
console.log(process.env.PORT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const app: Application = express();

let corsOptions = {
    origin: ["http://localhost:3000","http://localhost:3003"],
    optionsSuccessStatus: 200,
    credentials: true,
}

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    return res.status(200).json({ success: "true", message: "Welcome to the API" });
});

app.use((err: Error, req: Request, res: Response, next: Function) => {
    if (err instanceof HttpError) {
        return res.status(err.statusCode).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: err.message || "Internal Server Error" });
});

export default app;


