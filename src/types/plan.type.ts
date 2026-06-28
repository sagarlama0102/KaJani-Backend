import z from "zod";

export const PlanSchema = z.object({
    title:z.string().min(5,"Title must be at least 5 characters"),
    description:z.string().min(20, "Description must be at least 20 characters"),
    category: z.enum([
        "social",
        "outdoor",
        "sports",
        "food",
        "educational",
        "creative",
        "travel",
        ]),
    coverImage: z.string().optional(),
    location: z.string().trim().min(1, "Location is required"),
    date: z.string().min(1, "Date is required"),
    time: z.string().min(1, "Time is required"),
    isPublic: z.boolean().default(true),
    maxMembers: z.number().min(2).optional(),
    status: z.enum(["upcoming", "ongoing", "completed", "cancelled"]).default("upcoming"),

});

export type PlanType = z.infer<typeof PlanSchema>;
