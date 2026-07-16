import { ReactNode } from "react";
import { cn } from "@/lib/utils";
export const Button = ({
  children,
  className,
  icon,
  onClick,
  type,
  disabled
}: {
  children: ReactNode,
  className?: string,
  icon?: ReactNode,
  onClick?: () => void,
  type?: "submit"| "reset"| "button",
  disabled?: boolean
}) => {
  return (
    <button
    onClick={onClick}
    disabled= {disabled}
    type={type}
      
      className={cn(
        ` flex justify-center gap-2 px-6 py-2 bg-[#E35336] text-white font-bold rounded-xl border-2 border-[#1e1e1e] shadow-[3px_3px_0px_0px_#1e1e1e] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all cursor-pointer`,
        className,
      )}
    >
      {children}
      <div>{icon}</div>
    </button>
  );
};
