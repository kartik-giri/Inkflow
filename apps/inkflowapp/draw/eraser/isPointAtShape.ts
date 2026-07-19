import { Shape } from "@/types/canvas";
import { distanceToLine } from "./distanceToLine";

export const isPointsAtShape = (x: number, y: number, existingShapes: Shape[], ctx: CanvasRenderingContext2D) => {
    const STROKE_THRESHOLD = 8; // Adjust this for easier/harder erasing

    // Start from top shape — last drawn is on top
    for (let i = existingShapes.length - 1; i >= 0; i--) {
        const shape = existingShapes[i];

        if (shape.type === "rect") {
            const edges = [
                { x1: shape.x, y1: shape.y, x2: shape.x + shape.width, y2: shape.y }, // Top
                { x1: shape.x + shape.width, y1: shape.y, x2: shape.x + shape.width, y2: shape.y + shape.height }, // Right
                { x1: shape.x + shape.width, y1: shape.y + shape.height, x2: shape.x, y2: shape.y + shape.height }, // Bottom
                { x1: shape.x, y1: shape.y + shape.height, x2: shape.x, y2: shape.y }  // Left
            ];
            for (const edge of edges) {
                if (distanceToLine(x, y, edge.x1, edge.y1, edge.x2, edge.y2) <= STROKE_THRESHOLD) {
                    return { shape, id: shape.id };
                }
            }
        }

        else if (shape.type === "circle") {
            const centerX = shape.x + shape.width / 2;
            const centerY = shape.y + shape.height / 2;
            const radius = Math.min(Math.abs(shape.width), Math.abs(shape.height)) / 2;
            const distance = Math.hypot(x - centerX, y - centerY);
            // Check if distance is close to radius (the ring), not inside it
            if (Math.abs(distance - radius) <= STROKE_THRESHOLD) {
                return { shape, id: shape.id };
            }
        }

        else if (shape.type === "pencil") {
            // For pencil, check distance between consecutive points
            for (let j = 0; j < shape.points.length - 1; j++) {
                const p1 = shape.points[j];
                const p2 = shape.points[j + 1];
                if (distanceToLine(x, y, p1.x, p1.y, p2.x, p2.y) <= STROKE_THRESHOLD) {
                    return { shape, id: shape.id };
                }
            }
        }

        else if (shape.type === "diamond") {
            const hw = shape.width / 2;
            const hh = shape.height / 2;
            const midX = shape.x + hw;
            const midY = shape.y + hh;
            const edges = [
                { x1: midX, y1: shape.y, x2: shape.x + shape.width, y2: midY }, // Top-Right
                { x1: shape.x + shape.width, y1: midY, x2: midX, y2: shape.y + shape.height }, // Bottom-Right
                { x1: midX, y1: shape.y + shape.height, x2: shape.x, y2: midY }, // Bottom-Left
                { x1: shape.x, y1: midY, x2: midX, y2: shape.y } // Top-Left
            ];
            for (const edge of edges) {
                if (distanceToLine(x, y, edge.x1, edge.y1, edge.x2, edge.y2) <= STROKE_THRESHOLD) {
                    return { shape, id: shape.id };
                }
            }
        }

        else if (shape.type === "line" || shape.type === "arrow") {
            const distance = distanceToLine(x, y, shape.startX, shape.startY, shape.endX, shape.endY);
            if (distance <= STROKE_THRESHOLD) {
                return { shape, id: shape.id };
            }
        }

        else if (shape.type === "text") {
            // Text is still treated as a bounding box as it's not a stroke-based shape
            ctx.font = "24px sans-serif";
            const lines = shape.text.split(`\n`);
            const height = lines.length * 24;
            let width = 0;
            lines.forEach((line) => {
                const lineWidth = ctx.measureText(line).width;
                if (lineWidth > width) width = lineWidth;
            });
            if (x >= shape.x && x <= shape.x + width && y >= shape.y && y <= shape.y + height) {
                return { shape, id: shape.id };
            }
        }
    }
    return null;
};