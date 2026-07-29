import { Shape } from "@/types/canvas"

export const isPointAtText = (worldX: number, worldY: number, shapes: Shape[], ctx: CanvasRenderingContext2D): any | null => {
    for (let i = shapes.length - 1; i >= 0; i--) {
        const shape: Shape = shapes[i];

        if (shape.type === "text") {
            const fontSize = shape.fontSize || 24;
            ctx.font = `${fontSize}px sans-serif`;
            const lines = shape.text.split('\n');
            const lineHeight = fontSize;
            const height = lines.length * lineHeight;

            let width = 0;
            lines.forEach((line: string) => {
                const lineWdth = ctx.measureText(line).width;
                if (lineWdth > width) width = lineWdth;
            });

            // Undo the shape's rotation on the click point before testing —
            // same pattern used in isPointsAtShape / mouseDownHandler
            const angle = shape.angle || 0;
            let testX = worldX;
            let testY = worldY;

            if (angle !== 0) {
                const cx = shape.x + width / 2;
                const cy = shape.y + height / 2;
                const dx = worldX - cx;
                const dy = worldY - cy;
                testX = cx + dx * Math.cos(-angle) - dy * Math.sin(-angle);
                testY = cy + dx * Math.sin(-angle) + dy * Math.cos(-angle);
            }

            if (
                testX >= shape.x &&
                testX <= shape.x + width &&
                testY >= shape.y &&
                testY <= shape.y + height
            ) {
                return shape;
            }
        }
    }
    return null;
}