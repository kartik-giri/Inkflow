import { Points, Shape, Shapes, StorkeColor, StorkeWidth } from "@/types/canvas";
import { getShapesAction } from "./getShapesAction";
import { drawArrow } from "./render/drawArrow";
import { drawLine } from "./render/drawLine";
import { drawDiamond } from "./render/drawDiamond";
import { drawPencil } from "./render/drawPencil";
import { drawCircle } from "./render/drawCircle";
import { drawRect } from "./render/drawRect";

const colorMap: Record<StorkeColor, string> = {
    [StorkeColor.black]: "#1e1e1e",
    [StorkeColor.blue]: "#1a72c2",
    [StorkeColor.green]: "#2d9e44",
    [StorkeColor.indigo]: "#6a64db",
    [StorkeColor.orange]: "#E35336",
    [StorkeColor.yellow]: "#f08c02",

}

const widthMap: Record<StorkeWidth, number> = {
    [StorkeWidth.mini]: 2,
    [StorkeWidth.small]: 4,
    [StorkeWidth.large]: 6,
    [StorkeWidth.xLarge]: 8
}

export class Game {

    private canvas: HTMLCanvasElement;
    private roomId: number;
    private socket: WebSocket;
    private selectedShape!: Shapes;
    private storkeColor!: StorkeColor;
    private storkeWidth!: StorkeWidth;

    private ctx!: CanvasRenderingContext2D;
    private existingShapes: Shape[] = [];
    private clicked: boolean = false;
    private destroyed: boolean = false;
    private currentPencilPoints: Points[] = []

    private startX: number = 0;
    private startY: number = 0;

    private lastX: number = 0;
    private lastY: number = 0;

    constructor(
        canvas: HTMLCanvasElement,
        roomId: number,
        socket: WebSocket,
        selectedShape: Shapes,
        storkeColor: StorkeColor,
        storkeWidth: StorkeWidth,
    ) {
        this.canvas = canvas;
        this.roomId = roomId;
        this.socket = socket;

        this.selectedShape = selectedShape;
        this.storkeWidth = storkeWidth;

        this.init(storkeColor, storkeWidth);
    }

    init = async (storkeColor: StorkeColor, storkeWidth: StorkeWidth) => {
        this.ctx = this.canvas.getContext("2d")!; // gettign context of canvas reference;
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";
        this.setColor(storkeColor);
        this.setStorkeWidth(storkeWidth);
        this.ctx.imageSmoothingEnabled = true;

        this.existingShapes = await getShapesAction(this.roomId);
        if (this.destroyed === true) return
        this.initEvents()
        this.render()
    }

    render = () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        this.existingShapes.forEach((shape) => {
            this.ctx.strokeStyle = shape.storkeColor
            this.ctx.lineWidth = shape.storkeWidth
            if (shape.type === "rect") {
                drawRect(this.ctx, shape.x, shape.y, shape.width, shape.height)
            }
            else if (shape.type === "circle") {
                drawCircle(shape.x, shape.y, shape.width, shape.height, this.ctx)
            }
            else if (shape.type === "pencil") {
                if (shape.points.length < 2) {
                    return
                }
                drawPencil(this.ctx, shape.points)
            }
            else if (shape.type === "diamond") {
                drawDiamond(shape.x, shape.y, shape.width, shape.height, this.ctx)
            }
            else if (shape.type === "line") {
                drawLine(shape.startX, shape.startY, shape.endX, shape.endY, this.ctx)

            }
            else if (shape.type === "arrow") {
                drawArrow(shape.startX, shape.startY, shape.endX, shape.endY, this.ctx)
            }
        })
    }

    setColor = (storkeColor: StorkeColor) => {
        this.storkeColor = storkeColor;
        this.ctx.strokeStyle = colorMap[this.storkeColor];
    }

    setStorkeWidth = (storkeWidth: StorkeWidth) => {
        this.storkeWidth = storkeWidth;
        this.ctx.lineWidth = widthMap[this.storkeWidth];
    }

    setSelectedShape = (selectedShape: Shapes) => {
        this.selectedShape = selectedShape;
    }

    mouseDownHandler = (e: MouseEvent) => {
        this.clicked = true;

        this.startX = e.offsetX;
        this.startY = e.offsetY;

        this.lastX = e.offsetX;
        this.lastY = e.offsetY;

        if (this.selectedShape === Shapes.pencil) {
            this.currentPencilPoints.push({
                x: e.offsetX,
                y: e.offsetY
            })
        }
    }

    mouseUpHandler = (e: MouseEvent) => {
        this.clicked = false;

        const width = e.offsetX - this.startX;
        const height = e.offsetY - this.startY

        console.log(`width: ${width}, height: ${height}`)
        let shape: Shape | null = null

        if (this.selectedShape === Shapes.rectangle) {
            shape = {
                type: "rect",
                x: this.startX,
                y: this.startY,
                width: width,
                height: height,
                storkeColor: colorMap[this.storkeColor],
                storkeWidth: widthMap[this.storkeWidth]
            }
        }
        else if (this.selectedShape === Shapes.circle) {

            shape = {
                type: "circle",
                x: this.startX,
                y: this.startY,
                width: e.offsetX - this.startX,
                height: e.offsetY - this.startY,
                storkeWidth: widthMap[this.storkeWidth],
                storkeColor: colorMap[this.storkeColor]
            }
        }
        else if (this.selectedShape === Shapes.pencil) {
            shape = {
                type: "pencil",
                points: this.currentPencilPoints,
                storkeColor: colorMap[this.storkeColor],
                storkeWidth: widthMap[this.storkeWidth]
            }
            this.currentPencilPoints = []
        }
        else if (this.selectedShape === Shapes.diamond) {
            shape = {
                type: "diamond",
                x: this.startX,
                y: this.startY,
                width: width,
                height: height,
                storkeColor: colorMap[this.storkeColor],
                storkeWidth: widthMap[this.storkeWidth]
            }
        }
        else if (this.selectedShape === Shapes.Line) {
            shape = {
                type: "line",
                startX: this.startX,
                startY: this.startY,
                endX: e.offsetX,
                endY: e.offsetY,
                storkeColor: colorMap[this.storkeColor],
                storkeWidth: widthMap[this.storkeWidth]
            }
        }
        else if (this.selectedShape === Shapes.Arrow) {
            shape = {
                type: "arrow",
                startX: this.startX,
                startY: this.startY,
                endX: e.offsetX,
                endY: e.offsetY,
                storkeColor: colorMap[this.storkeColor],
                storkeWidth: widthMap[this.storkeWidth]
            }
        }

        if (!shape) return

        this.existingShapes.push(shape);
        this.render()

        this.socket.send(
            JSON.stringify({
                type: "draw",
                message: JSON.stringify(
                    shape
                ),
                roomId: this.roomId
            })
        )
    }

    mouseMoveHandler = (e: MouseEvent) => {
        if (!this.clicked) {
            return
        }

        const width = e.offsetX - this.startX;
        const height = e.offsetY - this.startY

        if (this.selectedShape === Shapes.rectangle) {
            this.render()
            this.ctx.strokeStyle = colorMap[this.storkeColor];
            this.ctx.lineWidth = widthMap[this.storkeWidth];
            drawRect(this.ctx, this.startX, this.startY, width, height,)
        }
        else if (this.selectedShape === Shapes.circle) {
            this.render()  // clear preview and redraw existing shapes
            this.ctx.strokeStyle = colorMap[this.storkeColor];
            this.ctx.lineWidth = widthMap[this.storkeWidth];
            drawCircle(this.startX, this.startY, width,height, this.ctx)
        }
        else if (this.selectedShape === Shapes.pencil) {
            this.currentPencilPoints.push({
                x: e.offsetX,
                y: e.offsetY
            })

            this.render()
            this.ctx.strokeStyle = colorMap[this.storkeColor];
            this.ctx.lineWidth = widthMap[this.storkeWidth];
            drawPencil(this.ctx, this.currentPencilPoints)
            this.lastX = e.offsetX;
            this.lastY = e.offsetY
        }

        else if (this.selectedShape === Shapes.diamond) {
            this.render();
            this.ctx.strokeStyle = colorMap[this.storkeColor];
            this.ctx.lineWidth = widthMap[this.storkeWidth];
            drawDiamond(this.startX, this.startY, width, height, this.ctx)

        }
        else if (this.selectedShape === Shapes.Line) {
            this.render();
            this.ctx.strokeStyle = colorMap[this.storkeColor];
            this.ctx.lineWidth = widthMap[this.storkeWidth];
            drawLine(this.startX, this.startY, e.offsetX, e.offsetY, this.ctx)

        }
        else if (this.selectedShape === Shapes.Arrow) {
            this.render();
            this.ctx.strokeStyle = colorMap[this.storkeColor];
            this.ctx.lineWidth = widthMap[this.storkeWidth];

            drawArrow(this.startX, this.startY, e.offsetX, e.offsetY, this.ctx)
        }
    }

    onMessage = (e: MessageEvent) => {
        const message = JSON.parse(e.data);

        if (message.type === "draw") {
            const parsedShape = JSON.parse(message.message);

            if (parsedShape.type !== "rect" && parsedShape.type !== "circle" && parsedShape.type !== "pencil" && parsedShape.type !== "diamond" && parsedShape.type !== "line" && parsedShape.type !== "arrow") return
            this.existingShapes.push(parsedShape);
            this.render()
        }
    }

    initEvents = () => {
        this.canvas.addEventListener("mousedown", this.mouseDownHandler);
        this.canvas.addEventListener("mouseup", this.mouseUpHandler)
        this.canvas.addEventListener("mousemove", this.mouseMoveHandler);

        this.socket.onmessage = this.onMessage
    }

    cleanUpvents = () => {
        this.destroyed = true
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
        this.canvas.removeEventListener("mouseup", this.mouseUpHandler)
        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler)

        this.socket.onmessage = null
    }


}
