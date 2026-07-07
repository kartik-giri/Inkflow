"use client";
import useWindowSize from "@/hooks/useWindowSize";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { IconButton } from "./IconButton";
import {
  Circle,
  Eraser,
  Hand,
  Pencil,
  RectangleHorizontal,
} from "lucide-react";
import { Card } from "../ui/cardWrapper";

export enum Shapes {
  circle,
  rectangle,
  pencil,
  move,
  eraser,
  Hand
}
const Canvas = ({ roomId, socket }: { roomId: number; socket: WebSocket }) => {
  const { width, height } = useWindowSize();
  const [selectedShape, setSelectedShape] = useState<Shapes>(Shapes.pencil);

  return (
    <section className={cn(`relative`)}>
      <canvas
        className={cn(
          `bg-white  bg-[radial-gradient(#1e1e1e15_1px,transparent_2px)] [background-size:24px_24px]`,
        )}
        style={{ width: width, height: height }}
      ></canvas>
     
      {/* Shapes menu */}
      <div className={cn(`flex justify-center`)}>
        <Card className=" absolute top-4 p-1 rounded-md w-fit flex gap-6">
          <IconButton
            onClick={() => setSelectedShape(Shapes.pencil)}
            active={selectedShape === Shapes.pencil}
            icon={<Pencil />}
          ></IconButton>

          <IconButton
            onClick={() => {
              setSelectedShape(Shapes.circle);
            }}
            active={selectedShape === Shapes.circle}
            icon={<Circle />}
          ></IconButton>

          <IconButton
            onClick={() => {
              setSelectedShape(Shapes.rectangle);
            }}
            active={selectedShape === Shapes.rectangle}
            icon={<RectangleHorizontal />}
          ></IconButton>

          <IconButton
            onClick={() => {
              setSelectedShape(Shapes.eraser);
            }}
            active={selectedShape === Shapes.eraser}
            icon={<Eraser />}
          ></IconButton>

          <IconButton onClick={()=>{
            setSelectedShape(Shapes.Hand)
          }} active={selectedShape === Shapes.Hand} icon={<Hand />}></IconButton>
        </Card>
      </div>
    </section>
  );
};

export default Canvas;
