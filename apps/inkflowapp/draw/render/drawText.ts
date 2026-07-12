export const drawText = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    text: string,
    
    color: string
) => {
    ctx.font = `Coming Soon, cursive`
    ctx.fillStyle = color
    ctx.fillText(text, x, y)
}