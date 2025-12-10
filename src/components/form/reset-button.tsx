/** biome-ignore-all lint/a11y/useButtonType: <explanation> */
"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface Props {
  className?: string;
  onClick?: VoidFunction;
}

export const ResetButton: React.FC<Props> = (props) => {
  const { className, onClick } = props;
  return (
    <button
      onClick={onClick}
      className={cn("cursor-pointer opacity-50 hover:opacity-100", className)}
    >
      <X />
    </button>
  );
};
