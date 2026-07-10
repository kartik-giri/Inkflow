import { Points, Shape, Shapes, StorkeColor, StorkeWidth } from "@/types/canvas";
import { getShapesAction } from "./getShapesAction";

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
                this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            }
            else if (shape.type === "circle") {
                this.ctx.strokeStyle = shape.storkeColor;
                this.ctx.lineWidth = shape.storkeWidth;

                this.ctx.beginPath();
                this.ctx.arc(
                    shape.centerX,
                    shape.centerY,
                    shape.radius,
                    0,
                    Math.PI * 2,
                );

                this.ctx.stroke();
                this.ctx.closePath();
            }
            else if (shape.type === "pencil") {
                if (shape.points.length < 2) {
                    return
                }

                this.ctx.strokeStyle = shape.storkeColor;
                this.ctx.lineWidth = shape.storkeWidth;

                this.ctx.beginPath();
                this.ctx.moveTo(shape.points[0].x, shape.points[0].y);

                for (let i = 1; i < shape.points.length; i++) {
                    this.ctx.lineTo(shape.points[i].x, shape.points[i].y);
                }

                this.ctx.stroke();
                this.ctx.closePath();
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
            const radius = Math.min(Math.abs(width), Math.abs(height)) / 2;
            shape = {
                type: "circle",
                radius: radius,
                centerX: this.startX + width / 2,
                centerY: this.startY + height / 2,
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
            this.ctx.strokeRect(this.startX, this.startY, width, height)
        }
        else if (this.selectedShape === Shapes.circle) {
            this.render()  // clear preview and redraw existing shapes
            const centerX = this.startX + width / 2;
            const centerY = this.startY + height / 2;
            const radius = Math.min(Math.abs(width), Math.abs(height)) / 2;

            this.ctx.strokeStyle = colorMap[this.storkeColor];
            this.ctx.lineWidth = widthMap[this.storkeWidth];

            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.closePath();
        }
        else if (this.selectedShape === Shapes.pencil) {
            this.currentPencilPoints.push({
                x: e.offsetX,
                y: e.offsetY
            })

            this.render()

            this.ctx.strokeStyle = colorMap[this.storkeColor];
            this.ctx.lineWidth = widthMap[this.storkeWidth];

            this.ctx.beginPath();
            this.ctx.moveTo(this.currentPencilPoints[0].x, this.currentPencilPoints[1].y);
            
            for(let i=1; i < this.currentPencilPoints.length; i++){
                this.ctx.lineTo(this.currentPencilPoints[i].x, this.currentPencilPoints[i].y)
            }
            this.ctx.stroke();
            this.ctx.closePath()


            this.lastX = e.offsetX;
            this.lastY = e.offsetY
        }
    }

    onMessage = (e: MessageEvent) => {
        const message = JSON.parse(e.data);

        if (message.type === "draw") {
            const parsedShape = JSON.parse(message.message);

            if (parsedShape.type !== "rect" && parsedShape.type !== "circle" && parsedShape.type !== "pencil") return
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
