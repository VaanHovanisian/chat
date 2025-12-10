"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { FormInput } from "./form-input";
import { Button } from "../ui/button";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormSchema } from "@/@types/form";
import { registerFormSchema } from "@/constants/register-form-schema";
import { registerProfile } from "@/app/actions";
import toast from "react-hot-toast";

interface Props {
  className?: string;
  onClose: () => void;
}

export const RegisterForm: React.FC<Props> = (props) => {
  const { className, onClose } = props;
  const form = useForm({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormSchema) => {
    try {
      const result = await registerProfile({
        name: data.name,
        password: data.password,
        email: data.email,
      });
      if (result?.error) {
        toast.error(result?.error || "failed registration");
      } else {
        toast.success(
          "successfully registered you send verification email token",
        );
      }
      onClose();
    } catch (error) {
      toast.error("unsuccessful registration");
      console.log(error);
    }
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-5", className)}
      >
        <FormInput name={"name"} label="Full Name" />
        <FormInput name={"email"} type="email" label="Email" />
        <FormInput name={"password"} type="password" label="Password" />
        <FormInput
          name={"confirmPassword"}
          type="password"
          label="Confirm Password"
        />
        <Button type="submit">Register</Button>
      </form>
    </FormProvider>
  );
};
