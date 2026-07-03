import { z } from "zod";

export const NotificationSchema = z.object({
  recipient: z.string(),
  sender: z.string(),    
  type: z.enum([
    "plan_joined",       // someone joined your plan
    "plan_left",         // someone left your plan
  ]),
  planId: z.string(),    
  message: z.string(),   
  isRead: z.boolean().default(false),
});

export type NotificationType = z.infer<typeof NotificationSchema>;