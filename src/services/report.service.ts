import { ReportModel } from "../models/report.model";
import { CreateReportDTO } from "../dtos/report.dto";
import { HttpError } from "../errors/http-error";
import { UserRepository } from "../repositories/user.repository";

const userRepository = new UserRepository();

export class ReportService {
  async createReport(reporterId: string, data: CreateReportDTO) {
    if (reporterId === data.reportedUser) {
      throw new HttpError(400, "You cannot report yourself");
    }

    // Confirm the reported user actually exists
    const reported = await userRepository.getUserById(data.reportedUser);
    if (!reported) {
      throw new HttpError(404, "The user you're reporting was not found");
    }

    // No duplicate pending report from the same reporter for the same user
    const existing = await ReportModel.findOne({
      reporter: reporterId,
      reportedUser: data.reportedUser,
      status: "pending",
    });
    if (existing) {
      throw new HttpError(400, "You've already reported this user");
    }

    await ReportModel.create({
      reporter: reporterId,
      reportedUser: data.reportedUser,
      reason: data.reason,
      note: data.note,
    });

    return { message: "Report submitted. Our team will review it." };
  }

  // Admin-only: list pending reports for manual review
  async getReports() {
    const reports = await ReportModel.find({ status: "pending" })
      .populate("reporter", "username firstName lastName")
      .populate("reportedUser", "username firstName lastName profilePicture")
      .sort({ createdAt: -1 });
    return reports;
  }
}