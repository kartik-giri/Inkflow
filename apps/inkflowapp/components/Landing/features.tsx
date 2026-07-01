import { cn } from "@/lib/utils";
import { Card } from "../ui/cardWrapper";

import { BellElectric, Bolt, Cloud, MousePointer2, Pencil, Star, StarsIcon, Users2, Zap, ZapOff } from "lucide-react";
const Features = () => {
  return (
    <section
      className={cn(
        `w-screen bg-[radial-gradient(ellipse_at_center,#E3533620_0%,#ffffff_90%)] pb-30`,
      )}
    >
      <div className={cn(`px-4 pt-20 xl:pl-27`)}>
        <div className={cn(`text-[#E35336] font-semibold`)}>FEATURES</div>
        <div className={cn(`font-coming-soon text-4xl font-bold mt-3`)}>
          Everything a whiteboard should have — and nothing it shouldn't.
        </div>
      </div>

      <div
        className={cn(
          `p-4 grid grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-3  pt-20 xl:px-27`,
        )}
      >
        <Card className={cn(`p-8`)}>
          <div>
            <Card
              className={cn(`p-2 w-fit rounded-md bg-[#E35336] text-white`)}
            >
              <MousePointer2 />
            </Card>
          </div>

          <div className={cn(`font-coming-soon font-bold text-2xl pt-6 pb-1`)}>
            Realtime mulitplayer
          </div>
          <div className={cn(`text-sm text-gray-500`)}>
            See cursors, selections and edits stream in with zero perceptible
            lag.
          </div>
        </Card>

        <Card className={cn(`p-8`)}>
          <div>
            <Card
              className={cn(`p-2 w-fit rounded-md bg-[#6de6b7] text-black`)}
            >
              <Zap/>
            </Card>
          </div>

          <div className={cn(`font-coming-soon font-bold text-2xl pt-6 pb-1`)}>
            Built for Speed
          </div>
          <div className={cn(`text-sm text-gray-500`)}>
           Enjoy a fast, responsive canvas that stays smooth, even during large collaborative sessions.
          </div>
        </Card>

        <Card className={cn(`p-8`)}>
          <div>
            <Card
              className={cn(`p-2 w-fit rounded-md bg-[#fddf45] text-black`)}
            >
              <Pencil />
            </Card>
          </div>

          <div className={cn(`font-coming-soon font-bold text-2xl pt-6 pb-1`)}>
            Flexible Styling
          </div>
          <div className={cn(`text-sm text-gray-500`)}>
            Customize shapes, colors, strokes, and typography to create diagrams
            that match your style and workflow.
          </div>
        </Card>

        <Card className={cn(`p-8`)}>
          <div>
            <Card
              className={cn(`p-2 w-fit rounded-md bg-[#0a0a0a] text-white`)}
            >
              <StarsIcon/>
            </Card>
          </div>

          <div className={cn(`font-coming-soon font-bold text-2xl pt-6 pb-1`)}>
            Powerful Drawing Tools
          </div>
          <div className={cn(`text-sm text-gray-500`)}>
            Everything you need to sketch, diagram, and brainstorm—designed to feel natural and stay out of your way.
          </div>
        </Card>

        <Card className={cn(`p-8`)}>
          <div>
            <Card
              className={cn(`p-2 w-fit rounded-md bg-[#7ed3fc] text-black`)}
            >
              <Cloud/>
            </Card>
          </div>

          <div className={cn(`font-coming-soon font-bold text-2xl pt-6 pb-1`)}>
            Auto-Saved in the Cloud
          </div>
          <div className={cn(`text-sm text-gray-500`)}>
            Never lose your work. Every change is saved automatically and synced across all your devices.
          </div>
        </Card>

        <Card className={cn(`p-8`)}>
          <div>
            <Card
              className={cn(`p-2 w-fit rounded-md bg-[#6de6b7] text-black`)}
            >
              <Users2/>
            </Card>
          </div>

          <div className={cn(`font-coming-soon font-bold text-2xl pt-6 pb-1`)}>
            Shared Workspaces
          </div>
          <div className={cn(`text-sm text-gray-500`)}>
            Create dedicated spaces for projects and teams. Keep your whiteboards organized, accessible, and easy to collaborate on.
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Features;
