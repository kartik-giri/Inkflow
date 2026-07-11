export const drawDiamond = (startX: number, startY: number, width: number, height: number, ctx: CanvasRenderingContext2D) => {
    const centerX = startX + width / 2;
    const centerY = startY + height / 2;

    ctx.beginPath();
    ctx.moveTo(centerX, startY);                 // top
    ctx.lineTo(startX + width, centerY);         // right
    ctx.lineTo(centerX, startY + height);        // bottom
    ctx.lineTo(startX, centerY);                 // left

    ctx.closePath();
    ctx.stroke();
}