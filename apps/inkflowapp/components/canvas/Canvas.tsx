"use client";
import useWindowSize from "@/hooks/useWindowSize";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { IconButton } from "./IconButton";
import {
  Circle,
  Dot,
  Eraser,
  Hand,
  Pencil,
  RectangleHorizontal,
  Square,
} from "lucide-react";
import { Card } from "../ui/cardWrapper";

export enum Shapes {
  circle,
  rectangle,
  pencil,
  move,
  eraser,
  Hand,
}

export enum StorkeColor {
  black,
  orange,
  indigo,
  yellow,
  green,
  blue,
}

export enum StorkeWidth {
  mini,
  small,
  large,
  xLarge,
}
const Canvas = ({ roomId, socket }: { roomId: number; socket: WebSocket }) => {
  const { width, height } = useWindowSize();
  const [selectedShape, setSelectedShape] = useState<Shapes>(Shapes.pencil);
  const [storkeColor, setStorkeColor] = useState<StorkeColor>(
    StorkeColor.black,
  );
  const [storkeWidth, setStorkeWidth] = useState<StorkeWidth>(StorkeWidth.mini);

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
            className="p-2"
            onClick={() => setSelectedShape(Shapes.pencil)}
            activeShape={selectedShape === Shapes.pencil}
            icon={<Pencil />}
          ></IconButton>

          <IconButton
            className="p-2"
            onClick={() => {
              setSelectedShape(Shapes.circle);
            }}
            activeShape={selectedShape === Shapes.circle}
            icon={<Circle />}
          ></IconButton>

          <IconButton
            className="p-2"
            onClick={() => {
              setSelectedShape(Shapes.rectangle);
            }}
            activeShape={selectedShape === Shapes.rectangle}
            icon={<RectangleHorizontal />}
          ></IconButton>

          <IconButton
            className="p-2"
            onClick={() => {
              setSelectedShape(Shapes.eraser);
            }}
            activeShape={selectedShape === Shapes.eraser}
            icon={<Eraser />}
          ></IconButton>

          <IconButton
            className="p-2"
            onClick={() => {
              setSelectedShape(Shapes.Hand);
            }}
            activeShape={selectedShape === Shapes.Hand}
            icon={<Hand />}
          ></IconButton>
        </Card>
      </div>

      {/* Colors menu */}
      <div className={cn(`absolute top-40 left-4`)}>
        <Card className="p-0.5 flex flex-col rounded-md pr-3 py-2 ">
          <IconButton
            onClick={() => {
              setStorkeColor(StorkeColor.black);
            }}
            activeStorke={storkeColor === StorkeColor.black}
            icon={<Square color="black" fill="black" />}
            className="my-1"
          />
          <IconButton
            onClick={() => {
              setStorkeColor(StorkeColor.orange);
            }}
            activeStorke={storkeColor === StorkeColor.orange}
            icon={<Square color="#E35336" fill="#E35336" />}
            className="my-1"
          />
          <IconButton
            onClick={() => {
              setStorkeColor(StorkeColor.indigo);
            }}
            activeStorke={storkeColor === StorkeColor.indigo}
            icon={<Square color="#6a64db" fill="#6a64db" />}
            className="my-1"
          />
          <IconButton
            onClick={() => {
              setStorkeColor(StorkeColor.yellow);
            }}
            activeStorke={storkeColor === StorkeColor.yellow}
            icon={<Square color="#f08c02" fill="#f08c02" />}
            className="my-1"
          />
          <IconButton
            onClick={() => {
              setStorkeColor(StorkeColor.green);
            }}
            activeStorke={storkeColor === StorkeColor.green}
            icon={<Square color="#2d9e44" fill="#2d9e44" />}
            className="my-1"
          />
          <IconButton
            onClick={() => {
              setStorkeColor(StorkeColor.blue);
            }}
            activeStorke={storkeColor === StorkeColor.blue}
            icon={<Square color="#1a72c2" fill="#1a72c2" />}
            className="my-1"
          />
        </Card>
      </div>

      <div className={cn(`absolute top-97 left-4`)}>
        <Card className="p-0.5 flex flex-col items-center rounded-md pr-3 py-2 ">
          <IconButton
            onClick={() => {
              setStorkeWidth(StorkeWidth.mini);
            }}
            activeStorke={storkeWidth === StorkeWidth.mini}
            icon={
              <div className={cn("w-6 h-6 flex items-center justify-center border rounded-md overflow-hidden")}>
                <Dot className={cn("scale-[1]")} />
              </div>
            }
            className="my-1"
          />
          <IconButton
            onClick={() => {
              setStorkeWidth(StorkeWidth.small);
            }}
            activeStorke={storkeWidth === StorkeWidth.small}
            icon={
              <div className={cn("w-6 h-6 flex items-center justify-center border rounded-md overflow-hidden")}>
                <Dot className={cn("scale-[2]")} /> {/* mini */}
              </div>
            }
            className="my-1"
          />

          <IconButton
            onClick={() => {
              setStorkeWidth(StorkeWidth.large);
            }}
            activeStorke={storkeWidth === StorkeWidth.large}
            icon={
              <div className={cn("w-6 h-6 flex items-center justify-center border rounded-md overflow-hidden")}>
                <Dot className={cn("scale-[3]")} /> 
              </div>
            }
            className="my-1"
          />

          <IconButton
            onClick={() => {
              setStorkeWidth(StorkeWidth.xLarge);
            }}
            activeStorke={storkeWidth === StorkeWidth.xLarge}
            icon={
              <div className={cn("w-6 h-6 flex items-center justify-center border rounded-md overflow-hidden")}>
                <Dot className={cn("scale-[4]")} /> 
              </div>
            }
            className="my-1"
          />
        </Card>
      </div>
    </section>
  );
};

export default Canvas;
