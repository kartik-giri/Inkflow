// Inside render/drawText.ts
export const drawText = (
    ctx: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    text: string, 
    color: string,
    fontSize?:number
) => {
    ctx.fillStyle = color;
    ctx.font = `${fontSize}px sans-serif`; // Make sure this matches the textarea font
    ctx.textBaseline = "top"; // Important so the text aligns with where the click happened
    
    
    // Handle multi-line text
    const lines = text.split('\n');
    const lineHeight = fontSize!; // Adjust based on font size

    lines.forEach((line, index) => {
        ctx.fillText(line, x, y + (index * lineHeight));
    });
}