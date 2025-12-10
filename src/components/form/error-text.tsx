import { cn } from "@/lib/utils";
import React from "react";

interface Props {
  className?: string;
  text: string;
  label?: string;
}

export const ErrorText: React.FC<Props> = (props) => {
  const { className, text, label } = props;
  return (
    <label htmlFor={label} className={cn("text-red-500", className)}>
      {text}
    </label>
  );
};
