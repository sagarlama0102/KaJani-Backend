import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import admin from "firebase-admin";
import * as serviceAccount from "../firebase-service-account.json";
import { HttpError } from "./errors/http-error";
import authRoutes from "./routes/auth.route";
import planRoutes from "./routes/plan.route";
import notificationRoutes from "./routes/notification.route";
import path from 'path';

dotenv.config();


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const app: Application = express();


app.use(cors()); // open for Flutter mobile
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({ success: true, message: "Kajani API is running" });
});


app.use((err: Error, req: Request, res: Response, next: Function) => {
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }
  return res.status(500).json({ success: false, message: err.message || "Internal Server Error" });
});

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

export default app;