import { Shape } from "@/types/canvas";
import { distanceToLine } from "./distanceToLine";

// Rotate a point (x, y) backward by -angle around a center point (cx, cy).
// This "undoes" the shape's rotation so the existing hit-test math
// (written assuming an unrotated shape) still works correctly.
const rotatePointInverse = (
    x: number,
    y: number,
    cx: number,
    cy: number,
    angle: number,
) => {
    if (!angle) return { x, y };
    const dx = x - cx;
    const dy = y - cy;
    return {
        x: cx + dx * Math.cos(-angle) - dy * Math.sin(-angle),
        y: cy + dx * Math.sin(-angle) + dy * Math.cos(-angle),
    };
};

// Compute each shape's rotation center (matches the same center used
// in Game.render()/renderGizmo() when applying ctx.rotate)
const getShapeCenter = (shape: Shape, ctx: CanvasRenderingContext2D) => {
    if (shape.type === "rect" || shape.type === "diamond" || shape.type === "circle") {
        return { x: shape.x + shape.width / 2, y: shape.y + shape.height / 2 };
    }
    if (shape.type === "line" || shape.type === "arrow") {
        return {
            x: (shape.startX + shape.endX) / 2,
            y: (shape.startY + shape.endY) / 2,
        };
    }
    if (shape.type === "text") {
        ctx.font = `${shape.fontSize}px sans-serif`;
        const lines = shape.text.split("\n");
        const height = lines.length * shape.fontSize!;
        let width = 0;
        lines.forEach((line) => {
            const lineWidth = ctx.measureText(line).width;
            if (lineWidth > width) width = lineWidth;
        });
        return { x: shape.x + width / 2, y: shape.y + height / 2 };
    }
    if (shape.type === "pencil") {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        shape.points.forEach((p) => {
            minX = Math.min(minX, p.x);
            minY = Math.min(minY, p.y);
            maxX = Math.max(maxX, p.x);
            maxY = Math.max(maxY, p.y);
        });
        return { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
    }
    return { x: 0, y: 0 };
};

export const isPointsAtShape = (x: number, y: number, existingShapes: Shape[], ctx: CanvasRenderingContext2D) => {
    const STROKE_THRESHOLD = 8; // Adjust this for easier/harder erasing

    // Start from top shape — last drawn is on top
    for (let i = existingShapes.length - 1; i >= 0; i--) {
        const shape = existingShapes[i];

        // Undo this shape's rotation on the click point before testing,
        // so every check below can keep assuming an unrotated shape.
        const angle = (shape as any).angle || 0;
        const center = getShapeCenter(shape, ctx);
        const { x: testX, y: testY } = rotatePointInverse(x, y, center.x, center.y, angle);

        if (shape.type === "rect") {
            const edges = [
                { x1: shape.x, y1: shape.y, x2: shape.x + shape.width, y2: shape.y }, // Top
                { x1: shape.x + shape.width, y1: shape.y, x2: shape.x + shape.width, y2: shape.y + shape.height }, // Right
                { x1: shape.x + shape.width, y1: shape.y + shape.height, x2: shape.x, y2: shape.y + shape.height }, // Bottom
                { x1: shape.x, y1: shape.y + shape.height, x2: shape.x, y2: shape.y }  // Left
            ];
            for (const edge of edges) {
                if (distanceToLine(testX, testY, edge.x1, edge.y1, edge.x2, edge.y2) <= STROKE_THRESHOLD) {
                    return { shape, id: shape.id };
                }
            }
        }

        else if (shape.type === "circle") {
            const centerX = shape.x + shape.width / 2;
            const centerY = shape.y + shape.height / 2;
            const radius = Math.min(Math.abs(shape.width), Math.abs(shape.height)) / 2;
            const distance = Math.hypot(testX - centerX, testY - centerY);
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
                if (distanceToLine(testX, testY, p1.x, p1.y, p2.x, p2.y) <= STROKE_THRESHOLD) {
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
                if (distanceToLine(testX, testY, edge.x1, edge.y1, edge.x2, edge.y2) <= STROKE_THRESHOLD) {
                    return { shape, id: shape.id };
                }
            }
        }

        else if (shape.type === "line" || shape.type === "arrow") {
            const distance = distanceToLine(testX, testY, shape.startX, shape.startY, shape.endX, shape.endY);
            if (distance <= STROKE_THRESHOLD) {
                return { shape, id: shape.id };
            }
        }

        else if (shape.type === "text") {
            // Text is still treated as a bounding box as it's not a stroke-based shape
            ctx.font = `${shape.fontSize}px sans-serif`;
            const lines = shape.text.split(`\n`);
            const height = lines.length * shape.fontSize!;
            let width = 0;
            lines.forEach((line) => {
                const lineWidth = ctx.measureText(line).width;
                if (lineWidth > width) width = lineWidth;
            });
            if (testX >= shape.x && testX <= shape.x + width && testY >= shape.y && testY <= shape.y + height) {
                return { shape, id: shape.id };
            }
        }
    }
    return null;
};