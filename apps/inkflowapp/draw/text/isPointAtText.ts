import { Shape } from "@/types/canvas"

export const isPointAtText = (worldX: number, worldY: number, shapes:Shape[], ctx:CanvasRenderingContext2D): any | null => {
        // Loop backwards to select the top-most shape if they overlap
        for (let i = shapes.length - 1; i >= 0; i--) {
            const shape:Shape = shapes[i];
            
            if (shape.type === "text") {
                ctx.font = "24px sans-serif"; 
                const lines = shape.text.split('\n');
                const lineHeight = 24; // Approximate height per line
                const height = lines.length * lineHeight;
                
                // Find the widest line of text
                let width = 0;
                lines.forEach((line: string) => {
                    const lineWdth = ctx.measureText(line).width;
                    if (lineWdth > width) width = lineWdth;
                });

                // Assuming textBaseline = "top" was used in your drawText function
                if (
                    worldX >= shape.x && 
                    worldX <= shape.x + width &&
                    worldY >= shape.y && 
                    worldY <= shape.y + height
                ) {
                    return shape;
                }
            }
        }
        return null;
    }
