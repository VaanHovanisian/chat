"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { Input } from "../ui/input";
import { ResetButton } from "./reset-button";
import { ErrorText } from "./error-text";
import { useFormContext } from "react-hook-form";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label?: string;
  name: string;
  required?: boolean;
}

export const FormInput: React.FC<Props> = (props) => {
  const { className, name, label, required, ...inputProps } = props;

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const value = watch(name);
  const onReset = () => setValue(name, "");
  const errorText = errors[name]?.message;

  return (
    <div className={cn(" flex flex-col", className)}>
      {label && (
        <label htmlFor={`form-input-${name}`}>
          {label} {required && <span className="text-red-500"></span>}
        </label>
      )}
      <div className="relative">
        <Input
          {...inputProps}
          {...register(name)}
          name={name}
          id={`form-input${name}`}
        />
        {value && (
          <ResetButton
            onClick={onReset}
            className="absolute right-2 top-1/2 -translate-y-1/2"
          />
        )}
      </div>
      {errorText && (
        <ErrorText label={`form-input-${name}`} text={errorText as string} />
      )}
    </div>
  );
};
