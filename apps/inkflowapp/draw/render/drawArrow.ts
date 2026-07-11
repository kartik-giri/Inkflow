export const drawArrow = (
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    ctx:CanvasRenderingContext2D
) => {
    const dx = endX - startX;
    const dy = endY - startY;

    const length = Math.sqrt(dx * dx + dy * dy);
    if (length < 5) return;

    const headLength = 15;
    const angle = Math.atan2(endY - startY, endX - startX);

    ctx.beginPath();

    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);

    // First wing
    ctx.moveTo(endX, endY);
    ctx.lineTo(
        endX - headLength * Math.cos(angle - Math.PI / 6),
        endY - headLength * Math.sin(angle - Math.PI / 6)
    );

    // Second wing
    ctx.moveTo(endX, endY);
    ctx.lineTo(
        endX - headLength * Math.cos(angle + Math.PI / 6),
        endY - headLength * Math.sin(angle + Math.PI / 6)
    );

    ctx.stroke();

}