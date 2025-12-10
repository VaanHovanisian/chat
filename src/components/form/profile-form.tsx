"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { FormInput } from "./form-input";
import { Button } from "../ui/button";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileFormSchema } from "@/@types/form";
import toast from "react-hot-toast";
import { User } from "@prisma/client";
import { signOut } from "next-auth/react";
import { profileFormSchema } from "@/constants/profile-form-schema";
import { updateProfile } from "@/app/actions";

interface Props {
  className?: string;
  data: User;
  children?: React.ReactNode;
}

export const ProfileForm: React.FC<Props> = (props) => {
  const { className, data, children } = props;
  const form = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      email: data.email,
      password: "",
      name: data.name,
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ProfileFormSchema) => {
    try {
      const result = await updateProfile({
        name: data.name,
        password: data.password,
        email: data.email,
      });
      if (result) {
        toast.error("please go to email for confirmation");
        return;
      }
      toast.success("successfully changed");
      console.log(data);
    } catch (error) {
      toast.error("unsuccessful change");
      console.log(error);
    }
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-4", className)}
      >
        <FormInput name={"fullName"} label="Ամբողջական անուն" />
        <FormInput name={"email"} type="email" label="Էլ" />
        <FormInput name={"password"} type="password" label="Գաղտնաբառ" />
        <FormInput
          name={"confirmPassword"}
          type="password"
          label="Հաստատեք գաղտնաբառը"
        />
        <div className="flex items-center gap-4">
          <Button>Պահպանել</Button>
          <Button
            type="button"
            onClick={async () => await signOut({ callbackUrl: "/" })}
          >
            Դուրս գալ
          </Button>
          {children}
        </div>
      </form>
    </FormProvider>
  );
};
