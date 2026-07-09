import { Shape, Shapes, StorkeColor, StorkeWidth } from "@/types/canvas";
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
    private existingShapes: Shape[] =[];

    constructor(
        canvas: HTMLCanvasElement,
        roomId: number,
        socket: WebSocket,
        selectedShape: Shapes,
        storkeColor: StorkeColor,
        storkeWidth: StorkeWidth
    ) {
        this.canvas = canvas;
        this.roomId = roomId;
        this.socket = socket;

        this.selectedShape = selectedShape;
        this.storkeWidth = storkeWidth;

        this.init(storkeColor, storkeWidth);
    }

    init = async(storkeColor: StorkeColor, storkeWidth: StorkeWidth) => {
        this.ctx = this.canvas.getContext("2d")!; // gettign context of canvas reference;
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";
        this.setColor(storkeColor);
        this.setStorkeWidth(storkeWidth);

        this.existingShapes = await getShapesAction(this.roomId);
    }


    setColor = (storkeColor: StorkeColor) => {
        this.storkeColor = storkeColor;
        this.ctx.strokeStyle = colorMap[this.storkeColor];
    }

    setStorkeWidth = (storkeWidth: StorkeWidth) => {
        this.storkeWidth = storkeWidth;
        this.ctx.lineWidth = widthMap[this.storkeWidth];
    }

    setSelectedShape = (selectedShape: Shapes)=>{
        this.selectedShape = selectedShape;
    }
}
