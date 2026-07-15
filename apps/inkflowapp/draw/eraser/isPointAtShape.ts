import { Shape } from "@/types/canvas";
import { distanceToLine } from "./distanceToLine";

export const isPointsAtShape = (x: number, y: number, existingShapes:Shape[], ctx:CanvasRenderingContext2D) => {
    // Start from top shape — last drawn is on top
    for (let i = existingShapes.length - 1; i >= 0; i--) {
        const shape = existingShapes[i]

        if (shape.type === "rect") {
            if (
                x >= shape.x &&
                x <= shape.x + shape.width &&
                y >= shape.y &&
                y <= shape.y + shape.height
            ) {
                return { shape, id: shape.id }
            }
        }

        else if (shape.type === "circle") {
            const centerX = shape.x + shape.width / 2
            const centerY = shape.y + shape.height / 2
            const radius = Math.min(Math.abs(shape.width), Math.abs(shape.height)) / 2
            const distance = Math.hypot(x - centerX, y - centerY)
            if (distance <= radius) {
                return { shape, id: shape.id }
            }
        }

        else if (shape.type === "pencil") {
            for (const point of shape.points) {
                const distance = Math.hypot(x - point.x, y - point.y)
                if (distance <= 10) {  // 10px hitbox
                    return { shape, id: shape.id }
                }
            }
        }

        else if (shape.type === "diamond") {
            if (
                x >= shape.x &&
                x <= shape.x + shape.width &&
                y >= shape.y &&
                y <= shape.y + shape.height
            ) {
                return { shape, id: shape.id }
            }
        }

        else if (shape.type === "line" || shape.type === "arrow") {
            const distance = distanceToLine(
                x, y,
                shape.startX, shape.startY,
                shape.endX, shape.endY
            )
            if (distance <= 8) {
                return { shape, id: shape.id }
            }
        }

        else if (shape.type === "text") {
            ctx.font = "24px 'Coming Soon', cursive"
            const textWidth = ctx.measureText(shape.text).width
            if (
                x >= shape.x &&
                x <= shape.x + textWidth &&
                y >= shape.y - 24 &&
                y <= shape.y
            ) {
                return { shape, id:shape.id }
            }
        }
    }
    return null
}