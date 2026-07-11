export const drawCircle = (startX:number, startY:number, width:number, height:number, ctx:CanvasRenderingContext2D) => {
    const centerX = startX + width / 2;
    const centerY = startY + height / 2;
    const radius = Math.min(Math.abs(width), Math.abs(height)) / 2;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();
}