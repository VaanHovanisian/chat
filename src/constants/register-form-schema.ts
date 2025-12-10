import { z } from "zod";
import { loginFormSchema, passwordSchema } from "./login-form-schema";

export const registerFormSchema = loginFormSchema
  .merge(
    z.object({
      name: z.string().min(2, { message: "Write your full name" }),
      confirmPassword: passwordSchema,
    }),
  )
  .refine((data) => data.password === data.confirmPassword, {
    message: "Write the correct password",
    path: ["confirmPassword"],
  });
