import { Shape } from "@/types/canvas";
import { drawRect } from "./drawRect";
import { drawCircle } from "./drawCircle";
import { drawPencil } from "./drawPencil";
import { drawDiamond } from "./drawDiamond";
import { drawLine } from "./drawLine";
import { drawArrow } from "./drawArrow";

export const renderShape = (ctx: CanvasRenderingContext2D, shape: Shape) => {
    switch (shape.type) {
        case "rect":
            drawRect(ctx, shape.x, shape.y, shape.width, shape.height)
            break;
        case "circle":
            drawCircle(shape.x, shape.y, shape.width, shape.height, ctx)
            break;

        case "pencil":
            drawPencil(ctx, shape.points)
            break;
        case "diamond":
            drawDiamond(shape.x, shape.y, shape.width, shape.height, ctx)
            break;
        case "line":
            drawLine(shape.startX, shape.startY, shape.endX, shape.endY, ctx)
            break;
                case "arrow":
                drawArrow(shape.startX, shape.startY, shape.endX, shape.endY, ctx)
            break;
        case "line":
            drawLine(shape.startX, shape.startY, shape.endX, shape.endY, ctx)
            break;
    }
}