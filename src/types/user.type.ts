import z from "zod";

export const UserSchema = z.object({
  id: z.string().optional(),
  firstName: z.string().trim().min(1).optional(),
  lastName: z.string().trim().min(1).optional(),
  username: z.string().trim().min(3).optional(),
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").optional(), // optional for Google OAuth users
  profilePicture: z.string().optional(),
  interests: z.array(z.string()).optional(),
  provider: z.enum(["traditional", "google"]),
  firebaseUid: z.string().optional(), // only for Google OAuth users
  isOnboarded: z.boolean().default(false), // becomes true after interest selection
  isActive: z.boolean().default(true),
  isAdmin: z.boolean().default(false),
    
});
export type UserType = z.infer<typeof UserSchema>;