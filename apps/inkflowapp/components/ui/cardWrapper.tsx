import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(`
bg-white rounded-2xl border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.9)] ml-8 mr-8 md:m-0 p-8 w-full max-w-md`
        ,className
  )}
    >
      {children}
    </div>
  );
}