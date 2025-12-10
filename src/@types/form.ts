import { loginFormSchema } from "@/constants/login-form-schema";
import { profileFormSchema } from "@/constants/profile-form-schema";
import { registerFormSchema } from "@/constants/register-form-schema";
import { z } from "zod";

export type LoginFormSchema = z.infer<typeof loginFormSchema>;
export type RegisterFormSchema = z.infer<typeof registerFormSchema>;
export type ProfileFormSchema = z.infer<typeof profileFormSchema>;
