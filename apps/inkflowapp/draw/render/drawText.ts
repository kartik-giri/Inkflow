// Inside render/drawText.ts
export const drawText = (
    ctx: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    text: string, 
    color: string
) => {
    ctx.fillStyle = color;
    ctx.font = "24px coming-soon"; // Make sure this matches the textarea font
    ctx.textBaseline = "top"; // Important so the text aligns with where the click happened
    
    // Handle multi-line text
    const lines = text.split('\n');
    const lineHeight = 28; // Adjust based on font size

    lines.forEach((line, index) => {
        ctx.fillText(line, x, y + (index * lineHeight));
    });
}