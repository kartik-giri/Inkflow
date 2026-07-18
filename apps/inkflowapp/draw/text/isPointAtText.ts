import { Shape } from "@/types/canvas"

export const isPointAtText = (worldx:number, worldy:number, shapes:Shape[], ctx:CanvasRenderingContext2D)=>{
    for(const shape of shapes) {
        if(shape.type === "text"){
            ctx.font = "24px sans-serif";
            const textWidth = ctx.measureText(shape.text).width;
            const lines = shape.text.split(`\n`);
            const height = Number(lines) * 24
            if(
                worldx>= shape.x &&
                worldx<= shape.x + textWidth &&
                worldy>= shape.y &&
                worldy<= shape.y + height
            ){
                console.log("Selected text is", shape.text)
                return({shape, id:shape.id})
            }
        }
    }
}