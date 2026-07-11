import { Points } from "@/types/canvas";

export const drawPencil = (ctx:CanvasRenderingContext2D, currentPencilPoints:Points[]) => {
    ctx.beginPath();
    ctx.moveTo(currentPencilPoints[0].x, currentPencilPoints[1].y);

    for (let i = 1; i < currentPencilPoints.length; i++) {
        ctx.lineTo(currentPencilPoints[i].x, currentPencilPoints[i].y)
    }
    ctx.stroke();
    ctx.closePath()
}