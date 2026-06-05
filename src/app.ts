import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import admin from "firebase-admin";
import * as serviceAccount from "../firebase-service-account.json";
import { HttpError } from "./errors/http-error";
import authRoutes from "./routes/auth.route";

dotenv.config();

// ─── Firebase Admin Init ──────────────────────────────────────────
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const app: Application = express();

// ─── Middleware ───────────────────────────────────────────────────
app.use(cors()); // open for Flutter mobile
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({ success: true, message: "Kajani API is running" });
});

// ─── Global Error Handler ─────────────────────────────────────────
app.use((err: Error, req: Request, res: Response, next: Function) => {
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }
  return res.status(500).json({ success: false, message: err.message || "Internal Server Error" });
});

export default app;