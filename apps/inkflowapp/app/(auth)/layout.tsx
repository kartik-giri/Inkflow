"use client"; // If you need this to be a client component
import { Logo } from "@/components/ui/logo";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

const AuthLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
    return (
        <section className={cn("px-4")}>
            <div className={cn("flex justify-center mt-10")}>
                <Logo />
            </div>
            {children}
        </section>
    );
};

export default AuthLayout;