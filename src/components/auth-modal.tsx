"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "./ui/dialog";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { Title } from "./title";
import { LoginForm, RegisterForm } from "./form";
import { Button } from "./ui/button";

interface Props {
  className?: string;
  children?: React.ReactNode;
}

export const AuthModal: React.FC<Props> = (props) => {
  const { className, children } = props;
  const [open, setOpen] = React.useState(false);
  const [toggleAuth, setToggleAuth] = React.useState<"LogIn" | "Register">(
    "Register",
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={cn("z-200", className)}>
        <DialogTitle />
        <div className="flex flex-col gap-5">
          <Title size="m" text={toggleAuth} />
          {toggleAuth === "Register" ? (
            <RegisterForm onClose={() => setOpen(false)} />
          ) : (
            <LoginForm onClose={() => setOpen(false)} />
          )}
          <div className="flex items-center justify-evenly">
            <Button
              onClick={() =>
                signIn("google", { redirect: true, callbackUrl: "/" })
              }
            >
              <Image
                src="/google-icon.png"
                alt="google-icon"
                width={24}
                height={24}
              />
              <span>Sign in with Google</span>
            </Button>
            <Button
              onClick={() =>
                signIn("github", { redirect: true, callbackUrl: "/" })
              }
            >
              <Image
                src="/github-icon.png"
                alt="google-icon"
                width={24}
                height={24}
              />
              <span>Sign in with Github</span>
            </Button>
          </div>
          <Button
            variant={"secondary"}
            onClick={() =>
              setToggleAuth((prev) => (prev === "LogIn" ? "Register" : "LogIn"))
            }
          >
            {toggleAuth === "LogIn" ? "Register" : "Войти"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
