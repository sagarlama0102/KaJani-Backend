import z from "zod";

export const CreateReportDTO = z.object({
  reportedUser: z.string().min(1, "Reported user is required"),
  reason: z.string().min(1, "A reason is required"),
  note: z.string().max(500).optional(),
});
export type CreateReportDTO = z.infer<typeof CreateReportDTO>;