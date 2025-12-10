"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { FormInput } from "./form-input";
import { Button } from "../ui/button";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFormSchema } from "@/constants/login-form-schema";
import { LoginFormSchema } from "@/@types/form";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

interface Props {
  className?: string;
  onClose: () => void;
}

export const LoginForm: React.FC<Props> = (props) => {
  const { className, onClose } = props;
  const form = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormSchema) => {
    try {
      const isLogin = await signIn("credentials", { ...data, redirect: false });
      if (!isLogin?.ok) {
        throw Error();
      }
      if (isLogin.error) {
        toast.error(isLogin.error);
        return;
      }
      toast.success("Successful login");
      onClose();
      console.log(data);
    } catch (error) {
      console.log(error);
      toast.error("Unsuccessful login please go to email for confirmation");
    }
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-5", className)}
      >
        <FormInput name={"email"} type="email" label="Email" />
        <FormInput name={"password"} type="password" label="Password" />
        <Button>Войти</Button>
      </form>
    </FormProvider>
  );
};
