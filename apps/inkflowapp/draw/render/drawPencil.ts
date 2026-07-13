import { Points } from "@/types/canvas";

export const drawPencil = (ctx:CanvasRenderingContext2D, currentPencilPoints:Points[]) => {
    if(currentPencilPoints.length <2) return
    ctx.beginPath();
    ctx.moveTo(currentPencilPoints[0].x, currentPencilPoints[0].y);

    for (let i = 1; i < currentPencilPoints.length; i++) {
        ctx.lineTo(currentPencilPoints[i].x, currentPencilPoints[i].y)
    }
    ctx.stroke();
    ctx.closePath()
}