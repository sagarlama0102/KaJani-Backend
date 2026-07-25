import { QueryFilter } from "mongoose";
import { PlanModel, IPlan } from "../models/plan.model";

export interface IPlanRepository {

  createPlan(data: Partial<IPlan>): Promise<IPlan>;
  getPlanById(id: string): Promise<IPlan | null>;
  getAllPlans(
    page: number,
    size: number,
    search?: string,
    category?: string,
    status?: string,
  ): Promise<{ plans: IPlan[]; total: number }>;
  updatePlan(id: string, data: Partial<IPlan>): Promise<IPlan | null>;
  deletePlan(id: string): Promise<boolean>;


  getMyPlans(userId: string): Promise<IPlan[]>;       // plans user created
  getJoinedPlans(userId: string): Promise<IPlan[]>;   // plans user joined
  getSavedPlans(userId: string): Promise<IPlan[]>;    // plans user saved


  joinPlan(planId: string, userId: string): Promise<IPlan | null>;
  leavePlan(planId: string, userId: string): Promise<IPlan | null>;

  savePlan(planId: string, userId: string): Promise<IPlan | null>;
  unsavePlan(planId: string, userId: string): Promise<IPlan | null>;

  isMember(planId: string, userId: string): Promise<boolean>;
  isCreator(planId: string, userId: string): Promise<boolean>;
}

export class PlanRepository implements IPlanRepository {

  async createPlan(data: Partial<IPlan>): Promise<IPlan> {
    const plan = new PlanModel(data);
    return plan.save();
  }

  async getPlanById(id: string): Promise<IPlan | null> {
    return PlanModel.findById(id)
      .populate("creator", "firstName lastName profilePicture username")
      .populate("members", "firstName lastName profilePicture username");
  }

  async getAllPlans(
    page: number,
    size: number,
    search?: string,
    category?: string,
    status?: string,
  ): Promise<{ plans: IPlan[]; total: number }> {
    const filter: QueryFilter<IPlan> = { isPublic: true };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
        filter.category = category as any;
    }
    if (status) {
        filter.status = status as any;
    }
    const [plans, total] = await Promise.all([
      PlanModel.find(filter)
        .populate("creator", "firstName lastName profilePicture username")
        .populate("members", "firstName lastName profilePicture username")
        .sort({ createdAt: -1 })
        .skip((page - 1) * size)
        .limit(size),
      PlanModel.countDocuments(filter),
    ]);

    return { plans, total };
  }

  async updatePlan(id: string, data: Partial<IPlan>): Promise<IPlan | null> {
    return PlanModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deletePlan(id: string): Promise<boolean> {
    const result = await PlanModel.findByIdAndDelete(id);
    return !!result;
  }

  async getMyPlans(userId: string): Promise<IPlan[]> {
    return PlanModel.find({ creator: userId })
    .populate("members", "firstName lastName profilePicture username")
      .sort({ createdAt: -1 });
  }

  async getJoinedPlans(userId: string): Promise<IPlan[]> {
    return PlanModel.find({ members: userId })
      .populate("creator", "firstName lastName profilePicture username")
      .populate("members", "firstName lastName profilePicture username")
      .sort({ createdAt: -1 });
  }

  async getSavedPlans(userId: string): Promise<IPlan[]> {
    return PlanModel.find({ savedBy: userId })
      .populate("creator", "firstName lastName profilePicture username")
      .populate("members", "firstName lastName profilePicture username")
      .sort({ createdAt: -1 });
  }

  async joinPlan(planId: string, userId: string): Promise<IPlan | null> {
    return PlanModel.findByIdAndUpdate(
      planId,
      { $addToSet: { members: userId } }, // $addToSet prevents duplicates
      { new: true }
    );
  }

  async leavePlan(planId: string, userId: string): Promise<IPlan | null> {
    return PlanModel.findByIdAndUpdate(
      planId,
      { $pull: { members: userId } }, // $pull removes the userId
      { new: true }
    );
  }


  async savePlan(planId: string, userId: string): Promise<IPlan | null> {
    return PlanModel.findByIdAndUpdate(
      planId,
      { $addToSet: { savedBy: userId } },
      { new: true }
    );
  }

  async unsavePlan(planId: string, userId: string): Promise<IPlan | null> {
    return PlanModel.findByIdAndUpdate(
      planId,
      { $pull: { savedBy: userId } },
      { new: true }
    );
  }

  async isMember(planId: string, userId: string): Promise<boolean> {
    const plan = await PlanModel.findOne({
      _id: planId,
      members: userId,
    });
    return !!plan;
  }

  async isCreator(planId: string, userId: string): Promise<boolean> {
    const plan = await PlanModel.findOne({
      _id: planId,
      creator: userId,
    });
    return !!plan;
  }
}