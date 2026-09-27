import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import admin from "firebase-admin";
import { HttpError } from "./errors/http-error";
import authRoutes from "./routes/auth.route";
import planRoutes from "./routes/plan.route";
import reportRoutes from "./routes/report.route";
import notificationRoutes from "./routes/notification.route";
import { generalLimiter } from "./middlewares/rate-limit.middleware";

dotenv.config();

const firebaseServiceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 as string, "base64").toString("utf-8"),
);

admin.initializeApp({
  credential: admin.credential.cert(firebaseServiceAccount as admin.ServiceAccount),
});

const app: Application = express();


app.use(cors()); // open for Flutter mobile
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(generalLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({ success: true, message: "Kajani API is running" });
});


app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error(err);
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }
  return res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
});



export default app;