import { z } from "zod";

export const profileFormSchema = z
  .object({
    name: z.string().min(2, { message: "Write your full name" }),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
    email: z.string().email({ message: "write your email" }),
  })

  .refine((data) => data.password === data.confirmPassword, {
    message: "Write the correct password",
    path: ["confirmPassword"],
  });
