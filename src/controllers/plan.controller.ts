import { PlanService } from "../services/plan.service";
import { Request, Response } from "express";
import { CreatePlanDTO, UpdatePlanDTO } from "../dtos/plan.dto";
import z from "zod";

const planService = new PlanService();

export class PlanController {


  async createPlan(req: Request, res: Response) {
    try {
      const parsed = CreatePlanDTO.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsed.error),
        });
      }
      const userId = (req as any).user._id.toString();
      const plan = await planService.createPlan(parsed.data, userId);
      return res.status(201).json({
        success: true,
        message: "Plan created successfully",
        data: plan,
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  // ─── Get All Plans ───────────────────────────────────────────────
  async getAllPlans(req: Request, res: Response) {
    try {
      const { page, size, search, category, status } = req.query as {
        page?: string;
        size?: string;
        search?: string;
        category?: string;
        status?: string;
      };
       console.log('📊 getAllPlans called with status:', status);
      const { plans, pagination } = await planService.getAllPlans(
        page, size, search, category, status
      );
      return res.status(200).json({
        success: true,
        message: "Plans fetched successfully",
        data: plans,
        pagination,
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }


  async getPlanById(req: Request, res: Response) {
    try {
        
      const plan = await planService.getPlanById(req.params.id as string);
      return res.status(200).json({
        success: true,
        message: "Plan fetched successfully",
        data: plan,
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  // ─── Update Plan ─────────────────────────────────────────────────
  async updatePlan(req: Request, res: Response) {
    try {
      const parsed = UpdatePlanDTO.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsed.error),
        });
      }
      const userId = (req as any).user._id.toString();
      const updated = await planService.updatePlan(req.params.id as string, parsed.data, userId);
      return res.status(200).json({
        success: true,
        message: "Plan updated successfully",
        data: updated,
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  // ─── Delete Plan ─────────────────────────────────────────────────
  async deletePlan(req: Request, res: Response) {
    try {
     const userId = (req as any).user._id.toString();
      const result = await planService.deletePlan(req.params.id as string, userId);
      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  // ─── Get My Plans ────────────────────────────────────────────────
  async getMyPlans(req: Request, res: Response) {
    try {
      const userId = (req as any).user._id.toString();
      const plans = await planService.getMyPlans(userId);
      return res.status(200).json({
        success: true,
        message: "My plans fetched successfully",
        data: plans,
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  // ─── Get Joined Plans ────────────────────────────────────────────
  async getJoinedPlans(req: Request, res: Response) {
    try {
      const userId = (req as any).user._id.toString();
      const plans = await planService.getJoinedPlans(userId);
      return res.status(200).json({
        success: true,
        message: "Joined plans fetched successfully",
        data: plans,
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  // ─── Get Saved Plans ─────────────────────────────────────────────
  async getSavedPlans(req: Request, res: Response) {
    try {
      const userId = (req as any).user._id.toString();
      const plans = await planService.getSavedPlans(userId);
      return res.status(200).json({
        success: true,
        message: "Saved plans fetched successfully",
        data: plans,
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  // ─── Join Plan ───────────────────────────────────────────────────
  async joinPlan(req: Request, res: Response) {
    try {
      const userId = (req as any).user._id.toString();
      const plan = await planService.joinPlan(req.params.id as string, userId);
      return res.status(200).json({
        success: true,
        message: "Joined plan successfully",
        data: plan,
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  // ─── Leave Plan ──────────────────────────────────────────────────
  async leavePlan(req: Request, res: Response) {
    try {
      const userId = (req as any).user._id.toString();
      const plan = await planService.leavePlan(req.params.id as string, userId);
      return res.status(200).json({
        success: true,
        message: "Left plan successfully",
        data: plan,
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  // ─── Toggle Save Plan ────────────────────────────────────────────
  async toggleSavePlan(req: Request, res: Response) {
    try {
      const userId = (req as any).user._id.toString();
      const result = await planService.toggleSavePlan(req.params.id as string, userId);
      return res.status(200).json({
        success: true,
        message: result.message,
        data: { saved: result.saved },
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async uploadCoverImage(req: Request, res: Response) {
  try {
   
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
     
    return res.status(200).json({
      success: true,
      message: "Cover image uploaded",
      data: { coverImage: imageUrl },
    });
  } catch (error: any) {
    return res.status(error.statusCode ?? 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
}
}