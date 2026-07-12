"use client";
import useWindowSize from "@/hooks/useWindowSize";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import {
  ArrowRight,
  Circle,
  Diamond,
  Dot,
  Eraser,
  Hand,
  Minus,
  Pencil,
  RectangleHorizontal,
  Square,
  TextInitial,
} from "lucide-react";
import { Card } from "../ui/cardWrapper";
import { Game } from "@/draw/Game";
import { Shapes, StorkeColor, StorkeWidth } from "@/types/canvas";

const Canvas = ({ roomId, socket }: { roomId: number; socket: WebSocket }) => {
  const { width, height } = useWindowSize();
  const [selectedShape, setSelectedShape] = useState<Shapes>(Shapes.pencil);
  const [storkeColor, setStorkeColor] = useState<StorkeColor>(
    StorkeColor.black,
  );
  const [storkeWidth, setStorkeWidth] = useState<StorkeWidth>(StorkeWidth.mini);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;

      const gameObj = new Game(
        canvas,
        roomId,
        socket,
        selectedShape,
        storkeColor,
        storkeWidth,
      );
      if (!gameObj) {
        return;
      }
      gameRef.current = gameObj;
      return () => {
        gameObj.cleanUpvents();
      };
    }
  }, []);

  useEffect(() => {
    if (gameRef && canvasRef.current) {
      const dpr = window.devicePixelRatio || 1;
      const canvas = canvasRef.current;
      canvas.width = width * dpr;
      canvas.height = height * dpr;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext("2d")!;
      ctx.scale(dpr, dpr);

      gameRef.current?.render();
    }
  }, [height, width]);

  useEffect(() => {
    if (gameRef) {
      gameRef.current?.setColor(storkeColor);
      gameRef.current?.setStorkeWidth(storkeWidth);
      gameRef.current?.setSelectedShape(selectedShape);
    }
  }, [storkeColor, storkeWidth, selectedShape]);

  return (
    <section className={cn(`relative`)}>
      <canvas
        className={cn(
          `bg-white  bg-[radial-gradient(#1e1e1e15_1px,transparent_2px)] [background-size:24px_24px]`,
        )}
        style={{ width: width, height: height }}
        width={width}
        height={height}
        ref={canvasRef}
      ></canvas>

      {/* Shapes menu */}
      <div className={cn(`flex justify-center`)}>
        <Card className=" absolute top-4 p-1 rounded-md w-fit flex flex-wrap gap-1 ">
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
              setSelectedShape(Shapes.diamond);
            }}
            activeShape={selectedShape === Shapes.diamond}
            icon={<Diamond />}
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
              setSelectedShape(Shapes.Arrow);
              setStorkeWidth(StorkeWidth.mini)
            }}
            activeShape={selectedShape === Shapes.Arrow}
            icon={<ArrowRight />}
          ></IconButton>

          <IconButton
            className="p-2"
            onClick={() => {
              setSelectedShape(Shapes.Line);
            }}
            activeShape={selectedShape === Shapes.Line}
            icon={<Minus />}
          ></IconButton>

          <IconButton
            className="p-2"
            onClick={() => setSelectedShape(Shapes.pencil)}
            activeShape={selectedShape === Shapes.pencil}
            icon={<Pencil />}
          ></IconButton>

          <IconButton
            className="p-2"
            onClick={() => setSelectedShape(Shapes.text)}
            activeShape={selectedShape === Shapes.text}
            icon={<TextInitial />}
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

      {/* Storke width menu */}
      <div className={cn(`absolute top-97 left-4`)}>
        <Card className="p-0.5 flex flex-col items-center rounded-md pr-3 py-2 ">
          <IconButton
            onClick={() => {
              setStorkeWidth(StorkeWidth.mini);
            }}
            activeStorke={storkeWidth === StorkeWidth.mini}
            icon={
              <div
                className={cn(
                  "w-6 h-6 flex items-center justify-center border rounded-md overflow-hidden",
                )}
              >
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
              <div
                className={cn(
                  "w-6 h-6 flex items-center justify-center border rounded-md overflow-hidden",
                )}
              >
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
              <div
                className={cn(
                  "w-6 h-6 flex items-center justify-center border rounded-md overflow-hidden",
                )}
              >
                <Dot className={cn("scale-[3]")} />
              </div>
            }
            className={cn`my-1 ${selectedShape === Shapes.Arrow ? "hidden" : ""}`}
          />

          <IconButton
            onClick={() => {
              setStorkeWidth(StorkeWidth.xLarge);
            }}
            activeStorke={storkeWidth === StorkeWidth.xLarge}
            icon={
              <div
                className={cn(
                  "w-6 h-6 flex items-center justify-center border rounded-md overflow-hidden",
                )}
              >
                <Dot className={cn("scale-[4]")} />
              </div>
            }
            className={cn`my-1 ${selectedShape === Shapes.Arrow ? "hidden" : ""}`}
          />
        </Card>
      </div>
    </section>
  );
};

export default Canvas;
