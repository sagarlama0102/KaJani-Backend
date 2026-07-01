import z from "zod";
import { PlanSchema } from "../types/plan.type";

export const CreatePlanDTO = PlanSchema.pick(
    {
        title: true,
        description: true,
        category: true,
        coverImage: true,
        location: true,
        time: true,
        endTime: true,
        date: true,
        endDate: true,
        isPublic: true,
        maxMembers: true
    }
)
export type CreatePlanDTO = z.infer<typeof CreatePlanDTO>;

export const UpdatePlanDTO = CreatePlanDTO.partial();

export type UpdatePlanDTO = z.infer<typeof UpdatePlanDTO>;