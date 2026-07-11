export const drawLine = (startX: number, startY: number, endX: number, endY: number, ctx: CanvasRenderingContext2D) => {

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY)
    ctx.stroke();
    ctx.closePath();
}