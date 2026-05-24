import { ReactNode } from "react";
import { cn } from "@/lib/utils";
export const Input = ({
  placeholder,
  className,
  name,
  type="text"
}: {
  placeholder: string,
  className?: string,
  name: string,
  type?:string
}) => {
  return (
    <input
      name={name}
      className={cn(
        `focus:outline-none p-2 w-full mb-2 mt-1 text-sm rounded-md border-2 border-black`,
        className,
      )}
      type={type}
      placeholder={placeholder}
    />
  );
};
