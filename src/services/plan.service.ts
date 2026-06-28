import { CreatePlanDTO, UpdatePlanDTO } from "../dtos/plan.dto";
import { PlanRepository } from "../repositories/plan.repository";
import { HttpError } from "../errors/http-error";

const planRepository = new PlanRepository();

export class PlanService {

  async createPlan(data: CreatePlanDTO, creatorId: string) {
    const plan = await planRepository.createPlan({
      ...data,
      creator: creatorId as any,
      members: [creatorId as any], // creator is automatically a member
      status: "upcoming",
    });
    return plan;
  }

  async getAllPlans(
    page?: string,
    size?: string,
    search?: string,
    category?: string,
    status?: string,
  ) {
    const pageNumber = page ? parseInt(page) : 1;
    const pageSize = size ? parseInt(size) : 10;

    const { plans, total } = await planRepository.getAllPlans(
      pageNumber,
      pageSize,
      search,
      category,
      status,
    );

    return {
      plans,
      pagination: {
        page: pageNumber,
        size: pageSize,
        totalItems: total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }


  async getPlanById(planId: string) {
    const plan = await planRepository.getPlanById(planId);
    if (!plan) throw new HttpError(404, "Plan not found");
    return plan;
  }

  async updatePlan(planId: string, data: UpdatePlanDTO, userId: string) {
    const isCreator = await planRepository.isCreator(planId, userId);
    if (!isCreator) throw new HttpError(403, "Only the creator can update this plan");

    const updated = await planRepository.updatePlan(planId, data);
    if (!updated) throw new HttpError(404, "Plan not found");
    return updated;
  }

  async deletePlan(planId: string, userId: string) {
    const isCreator = await planRepository.isCreator(planId, userId);
    if (!isCreator) throw new HttpError(403, "Only the creator can delete this plan");

    const deleted = await planRepository.deletePlan(planId);
    if (!deleted) throw new HttpError(404, "Plan not found");
    return { message: "Plan deleted successfully" };
  }


  async getMyPlans(userId: string) {
    return planRepository.getMyPlans(userId);
  }


  async getJoinedPlans(userId: string) {
    return planRepository.getJoinedPlans(userId);
  }


  async getSavedPlans(userId: string) {
    return planRepository.getSavedPlans(userId);
  }


  async joinPlan(planId: string, userId: string) {
    const plan = await planRepository.getPlanById(planId);
    if (!plan) throw new HttpError(404, "Plan not found");

    // Check if already a member
    const isMember = await planRepository.isMember(planId, userId);
    if (isMember) throw new HttpError(400, "You are already a member of this plan");

    // Check if plan is full
    if (plan.maxMembers && plan.members.length >= plan.maxMembers) {
      throw new HttpError(400, "This plan is already full");
    }

    // Check if plan is still upcoming
    if (plan.status === "completed" || plan.status === "cancelled") {
      throw new HttpError(400, "You cannot join a completed or cancelled plan");
    }

    return planRepository.joinPlan(planId, userId);
  }


  async leavePlan(planId: string, userId: string) {
    const plan = await planRepository.getPlanById(planId);
    if (!plan) throw new HttpError(404, "Plan not found");

    // Creator cannot leave their own plan
    const isCreator = await planRepository.isCreator(planId, userId);
    if (isCreator) throw new HttpError(400, "Creator cannot leave the plan. Delete it instead.");

    const isMember = await planRepository.isMember(planId, userId);
    if (!isMember) throw new HttpError(400, "You are not a member of this plan");

    return planRepository.leavePlan(planId, userId);
  }

  async toggleSavePlan(planId: string, userId: string) {
    const plan = await planRepository.getPlanById(planId);
    if (!plan) throw new HttpError(404, "Plan not found");

    const isSaved = plan.savedBy.some(
      (id) => id.toString() === userId
    );

    if (isSaved) {
      await planRepository.unsavePlan(planId, userId);
      return { message: "Plan unsaved", saved: false };
    } else {
      await planRepository.savePlan(planId, userId);
      return { message: "Plan saved", saved: true };
    }
  }
}