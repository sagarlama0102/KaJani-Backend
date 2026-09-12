import z from "zod";
import { UserSchema } from "../types/user.type";
export const CreateUserDTO = UserSchema.pick(
    { 
        email:true,
        password: true,
    }
).extend(
    {   
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string().min(8,"Confirm password must be at least 8 characters")
    }
).refine(
    (data)=> data.password === data.confirmPassword,
    {
        message: "Passwords do not match try again",
        path: ["confirmPassword"]
    }
)
export type CreateUserDTO = z.infer<typeof CreateUserDTO>;

export const LoginUserDTO = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6)
});
export type LoginUserDTO = z.infer<typeof LoginUserDTO>;

export const UpdateUserDTO = UserSchema.partial();

export type UpdateUserDTO = z.infer<typeof UpdateUserDTO>;

export const GoogleAuthSchema = z.object({
  idToken: z.string().min(1, "Firebase ID token is required"),
});

export const CompleteProfileDTO = UserSchema.pick({
  firstName: true,
  lastName: true,
  username: true,
}).extend({
    lastName: z.string().optional().default(""),
}).required({firstName: true, username: true});
export type CompleteProfileDTO = z.infer<typeof CompleteProfileDTO>;

export type GoogleAuthType = z.infer<typeof GoogleAuthSchema>;