import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(3, { message: "Your password should contain at least 8 symbols" });

export const loginFormSchema = z.object({
  email: z.string().email({ message: "write your email" }),
  password: passwordSchema,
});
