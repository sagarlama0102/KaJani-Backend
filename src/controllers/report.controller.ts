import { ReportService } from "../services/report.service";
import { CreateReportDTO } from "../dtos/report.dto";
import { Request, Response } from "express";
import z from "zod";
import { UserRepository } from "../repositories/user.repository";

const reportService = new ReportService();
const userRepository = new UserRepository();

export class ReportController {
  async createReport(req: Request, res: Response) {
    try {
      const reporterId = (req as any).user._id.toString();
      const parsed = CreateReportDTO.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ success: false, message: z.prettifyError(parsed.error) });
      }
      const result = await reportService.createReport(reporterId, parsed.data);
      return res.status(201).json({ success: true, message: result.message });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  // Admin-only
  async getReports(req: Request, res: Response) {
    try {
      const userId = (req as any).user._id.toString();
      const user = await userRepository.getUserById(userId);
      if (!user?.isAdmin) {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }
      const reports = await reportService.getReports();
      return res.status(200).json({ success: true, data: reports });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}