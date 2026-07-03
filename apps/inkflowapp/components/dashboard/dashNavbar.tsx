"use client";
import { cn } from "@/lib/utils";
import { Card } from "../ui/cardWrapper";
import { Logo } from "../ui/logo";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";
import Heading from "../ui/heading";

const DashNavBar = ({ email, name }: { email: string; name: string }) => {
  const avatar = email[0];
  return (
    <nav className={cn(`flex justify-between p-4 lg:px-27 border-b-2 border-black sticky top-0 bg-white z-50`)}>
      <div>
        <Logo disable={true} className="cursor-auto" />
      </div>

      <div className={cn(`flex gap-3`)}>
        <div>
          <Button
            onclick={() => {
              signOut({ callbackUrl: "/" });
            }}
          >
            Log out
          </Button>
        </div>

        <Card className="w-10 h-10 p-0 rounded-full flex items-center justify-center text-2xl bg-[#fddf45]">
          {avatar}
        </Card>

      </div>
    
    </nav>
  );
};

export default DashNavBar;
