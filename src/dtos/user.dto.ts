import z from "zod";
import { UserSchema } from "../types/user.type";
export const CreateUserDTO = UserSchema.pick(
    {
        firstName: true,
        lastName: true,
        email:true,
        username: true,
        password: true,
        phoneNumber: true,
        profilePicture: true,

    }
).extend(
    {   
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string().min(6,"Confirm password must be at least 6 characters")
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

export type GoogleAuthType = z.infer<typeof GoogleAuthSchema>;