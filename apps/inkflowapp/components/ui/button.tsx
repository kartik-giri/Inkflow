import { ReactNode } from "react";
import {cn} from "@/lib/utils"
export const Button = ({ children, className, icon, onclick }: { children: ReactNode, className?:string, icon:ReactNode, onclick?:()=>void}) => {
  return (
    <button className={cn(` flex justify-center gap-2 px-6 py-2 bg-[#6965db] text-white font-bold rounded-xl border-2 border-[#1e1e1e] shadow-[3px_3px_0px_0px_#1e1e1e] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all`, className)}>
      {children}
      <div>
        {icon}
      </div>
    </button>
  );
};
 