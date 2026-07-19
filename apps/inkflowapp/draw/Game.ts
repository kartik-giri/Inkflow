import {
    Points,
    Shape,
    Shapes,
    StorkeColor,
    StorkeWidth,
} from "@/types/canvas";
import { getShapesAction } from "./getShapesAction";
import { drawArrow } from "./render/drawArrow";
import { drawLine } from "./render/drawLine";
import { drawDiamond } from "./render/drawDiamond";
import { drawPencil } from "./render/drawPencil";
import { drawCircle } from "./render/drawCircle";
import { drawRect } from "./render/drawRect";
import { drawText } from "./render/drawText";
import { renderShape } from "./render/renderShape";
import { isPointsAtShape } from "./eraser/isPointAtShape";
import { isPointAtText } from "./text/isPointAtText";

const colorMap: Record<StorkeColor, string> = {
    [StorkeColor.black]: "#1e1e1e",
    [StorkeColor.blue]: "#1a72c2",
    [StorkeColor.green]: "#2d9e44",
    [StorkeColor.indigo]: "#6a64db",
    [StorkeColor.orange]: "#E35336",
    [StorkeColor.yellow]: "#f08c02",
};

const widthMap: Record<StorkeWidth, number> = {
    [StorkeWidth.mini]: 2,
    [StorkeWidth.small]: 4,
    [StorkeWidth.large]: 6,
    [StorkeWidth.xLarge]: 8,
};

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
    private currentPencilPoints: Points[] = [];
    private dpr = window.devicePixelRatio || 1;
    private setZoomValue!: (zoom: number) => void;

    //Variables for panning and zooming
    private panX: number = 0;
    private panY: number = 0;
    private isPanning: boolean = false;
    private lastPanX: number = 0;
    private lastPanY: number = 0;
    private scale: number = 1;

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
        setZoom: (zoom: number) => void,
    ) {
        this.canvas = canvas;
        this.roomId = roomId;
        this.socket = socket;
        this.setZoomValue = setZoom;

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

        this.existingShapes = (await getShapesAction(this.roomId)) as Shape[];
        if (this.destroyed === true) return;
        this.initEvents();
        this.render();
    };

    render = () => {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.setTransform(
            this.scale * this.dpr,
            0,
            0,
            this.scale * this.dpr,
            this.panX * this.dpr,
            this.panY * this.dpr,
        );

        this.existingShapes.forEach((shape) => {
            this.ctx.strokeStyle = shape.storkeColor;
            this.ctx.lineWidth = shape.storkeWidth;
            renderShape(this.ctx, shape);
        });
    };

    deleteShape = (id: string, shape: Shape) => {
        this.existingShapes = this.existingShapes.filter((shape) => {
            return shape.id !== id;
        });
        this.render();

        this.socket.send(
            JSON.stringify({
                type: "erase",
                message: JSON.stringify({
                    id: id,
                    shape: shape,
                }),
                roomId: this.roomId,
            }),
        );
    };

    setColor = (storkeColor: StorkeColor) => {
        this.storkeColor = storkeColor;
        this.ctx.strokeStyle = colorMap[this.storkeColor];
    };

    setStorkeWidth = (storkeWidth: StorkeWidth) => {
        this.storkeWidth = storkeWidth;
        this.ctx.lineWidth = widthMap[this.storkeWidth];
    };

    setSelectedShape = (selectedShape: Shapes) => {
        this.selectedShape = selectedShape;
    };

    getMouseCoordinates = (x: number, y: number) => {
        return {
            x: (x - this.panX) / this.scale,
            y: (y - this.panY) / this.scale,
        };
    };

    mouseDownHandler = (e: MouseEvent) => {
        if (e.button === 1) {
            ((this.isPanning = true),
                (this.lastPanX = e.clientX),
                (this.lastPanY = e.clientY));
            return;
        }

        this.clicked = true;

        const coords = this.getMouseCoordinates(e.offsetX, e.offsetY);
        this.startX = coords.x;
        this.startY = coords.y;
        this.lastX = coords.x;
        this.lastY = coords.y;

        if (this.selectedShape === Shapes.pencil) {
            this.currentPencilPoints.push({
                x: coords.x,
                y: coords.y,
            });
        } else if (this.selectedShape === Shapes.text) {
            const clickedTextShape = isPointAtText(
                coords.x,
                coords.y,
                this.existingShapes,
                this.ctx,
            );
            if (clickedTextShape) {
                this.handleTextInput(
                    e,
                    { x: clickedTextShape.x, y: clickedTextShape.y },
                    clickedTextShape,
                );
            } else {
                this.handleTextInput(e, coords);
            }
            this.clicked = false;
            return;
        }
    };

    mouseUpHandler = (e: MouseEvent) => {
        if (this.isPanning) {
            this.isPanning = false;
            return;
        }

        if (this.selectedShape === Shapes.text) {
            return;
        }
        this.clicked = false;

        const coords = this.getMouseCoordinates(e.offsetX, e.offsetY);
        const width = coords.x - this.startX;
        const height = coords.y - this.startY;

        console.log(`width: ${width}, height: ${height}`);
        let shape: Shape | null = null;

        if (this.selectedShape === Shapes.rectangle) {
            //Normalization
            const x = Math.min(this.startX, coords.x);
            const y = Math.min(this.startY, coords.y);

            const width = Math.abs(coords.x - this.startX);
            const height = Math.abs(coords.y - this.startY);
            shape = {
                type: "rect",
                id: crypto.randomUUID(),
                x: x,
                y: y,
                width: width,
                height: height,
                storkeColor: colorMap[this.storkeColor],
                storkeWidth: widthMap[this.storkeWidth],
            };
        } else if (this.selectedShape === Shapes.circle) {
            shape = {
                type: "circle",
                id: crypto.randomUUID(),
                x: this.startX,
                y: this.startY,
                width: width,
                height: height,
                storkeWidth: widthMap[this.storkeWidth],
                storkeColor: colorMap[this.storkeColor],
            };
        } else if (this.selectedShape === Shapes.pencil) {
            if (this.currentPencilPoints.length <= 1) {
                this.currentPencilPoints = [];
                return;
            }
            shape = {
                type: "pencil",
                id: crypto.randomUUID(),
                points: this.currentPencilPoints,
                storkeColor: colorMap[this.storkeColor],
                storkeWidth: widthMap[this.storkeWidth],
            };
            this.currentPencilPoints = []; //clearing pencil points after storing it in to DB.
        } else if (this.selectedShape === Shapes.diamond) {
            //Normalization
            const x = Math.min(this.startX, coords.x);
            const y = Math.min(this.startY, coords.y);

            const width = Math.abs(coords.x - this.startX);
            const height = Math.abs(coords.y - this.startY);
            shape = {
                type: "diamond",
                id: crypto.randomUUID(),
                x: x,
                y: y,
                width: width,
                height: height,
                storkeColor: colorMap[this.storkeColor],
                storkeWidth: widthMap[this.storkeWidth],
            };
        } else if (this.selectedShape === Shapes.Line) {
            shape = {
                type: "line",
                id: crypto.randomUUID(),
                startX: this.startX,
                startY: this.startY,
                endX: coords.x,
                endY: coords.y,
                storkeColor: colorMap[this.storkeColor],
                storkeWidth: widthMap[this.storkeWidth],
            };
        } else if (this.selectedShape === Shapes.Arrow) {
            shape = {
                type: "arrow",
                id: crypto.randomUUID(),
                startX: this.startX,
                startY: this.startY,
                endX: coords.x,
                endY: coords.y,
                storkeColor: colorMap[this.storkeColor],
                storkeWidth: widthMap[this.storkeWidth],
            };
        }

        if (!shape) return;

        this.existingShapes.push(shape);
        this.render();

        this.socket.send(
            JSON.stringify({
                type: "draw",
                message: JSON.stringify(shape),
                roomId: this.roomId,
            }),
        );
    };

    mouseMoveHandler = (e: MouseEvent) => {
        if (this.isPanning) {
            const dx = e.clientX - this.lastPanX;
            const dy = e.clientY - this.lastPanY;
            this.panX += dx;
            this.panY += dy;
            this.lastPanX = e.clientX;
            this.lastPanY = e.clientY;
            this.render();
            return;
        }
        if (!this.clicked) {
            return;
        }

        if (this.selectedShape === Shapes.text) {
            return;
        }

        const coods = this.getMouseCoordinates(e.offsetX, e.offsetY);
        const width = coods.x - this.startX;
        const height = coods.y - this.startY;

        if (this.selectedShape === Shapes.eraser) {
            const result = isPointsAtShape(
                coods.x,
                coods.y,
                this.existingShapes,
                this.ctx,
            );
            if (!result) return;
            this.deleteShape(result.id, result.shape);
            return;
        } else if (this.selectedShape === Shapes.rectangle) {
            this.render();
            this.ctx.strokeStyle = colorMap[this.storkeColor];
            this.ctx.lineWidth = widthMap[this.storkeWidth];
            drawRect(this.ctx, this.startX, this.startY, width, height);
        } else if (this.selectedShape === Shapes.circle) {
            this.render(); // clear preview and redraw existing shapes
            this.ctx.strokeStyle = colorMap[this.storkeColor];
            this.ctx.lineWidth = widthMap[this.storkeWidth];
            drawCircle(this.startX, this.startY, width, height, this.ctx);
        } else if (this.selectedShape === Shapes.pencil) {
            this.currentPencilPoints.push({
                x: coods.x,
                y: coods.y,
            });

            this.render();
            this.ctx.strokeStyle = colorMap[this.storkeColor];
            this.ctx.lineWidth = widthMap[this.storkeWidth];
            drawPencil(this.ctx, this.currentPencilPoints);
            this.lastX = coods.x;
            this.lastY = coods.y;
        } else if (this.selectedShape === Shapes.diamond) {
            this.render();
            this.ctx.strokeStyle = colorMap[this.storkeColor];
            this.ctx.lineWidth = widthMap[this.storkeWidth];
            drawDiamond(this.startX, this.startY, width, height, this.ctx);
        } else if (this.selectedShape === Shapes.Line) {
            this.render();
            this.ctx.strokeStyle = colorMap[this.storkeColor];
            this.ctx.lineWidth = widthMap[this.storkeWidth];
            drawLine(this.startX, this.startY, coods.x, coods.y, this.ctx);
        } else if (this.selectedShape === Shapes.Arrow) {
            this.render();
            this.ctx.strokeStyle = colorMap[this.storkeColor];
            this.ctx.lineWidth = widthMap[this.storkeWidth];

            drawArrow(this.startX, this.startY, coods.x, coods.y, this.ctx);
        }
    };

    wheelHandler = (e: WheelEvent) => {
        e.preventDefault();

        // Pinch zoom (ctrl + scroll on mac trackpad)
        if (e.ctrlKey) {
            const mouseX = e.offsetX;
            const mouseY = e.offsetY;

            // World position before zoom
            const coords = this.getMouseCoordinates(mouseX, mouseY);
            const worldX = coords.x;
            const worldY = coords.y;

            const zoom = 1 - e.deltaY * 0.01;
            const newScale = Math.min(Math.max(this.scale * zoom, 0.1), 5);
            this.scale = newScale;

            // Keep cursor fixed during zoom
            this.panX = mouseX - worldX * this.scale;
            this.panY = mouseY - worldY * this.scale;

            this.setZoomPercentage();
            this.render();
            return;
        }
        this.panX -= e.deltaX;
        this.panY -= e.deltaY;
        this.render();
    };

    onMessage = (e: MessageEvent) => {
        const message = JSON.parse(e.data);

        if (message.type === "draw") {
            const parsedShape = JSON.parse(message.message);

            if (
                parsedShape.type !== "rect" &&
                parsedShape.type !== "circle" &&
                parsedShape.type !== "pencil" &&
                parsedShape.type !== "diamond" &&
                parsedShape.type !== "line" &&
                parsedShape.type !== "arrow" &&
                parsedShape.type !== "text"
            ){
                return;
            }   

            this.existingShapes.push(parsedShape);
            this.render();
        } else if (message.type === "erase") {
            this.existingShapes = this.existingShapes.filter((shape) => {
                return shape.id !== message.id;
            });
            this.render();
        }else if(message.type === "editText"){
            const shapeIndex = this.existingShapes.findIndex((shape)=>{ //returns the index of the element which met the defined condition 
                return shape.id === message.id
            })
            this.existingShapes[shapeIndex] = message.shape;
            this.render()
        }
    };

    zoomIn = () => {
        const centerX = this.canvas.clientWidth / 2;
        const centerY = this.canvas.clientHeight / 2;

        const worldX = (centerX - this.panX) / this.scale;
        const worldY = (centerY - this.panY) / this.scale;

        this.scale = Math.min(this.scale + 0.1, 5);

        this.panX = centerX - worldX * this.scale;
        this.panY = centerY - worldY * this.scale;

        this.render();
    };

    zoomOut = () => {
        if (this.scale <= 0.1) return;
        const centerX = this.canvas.clientWidth / 2;
        const centerY = this.canvas.clientHeight / 2;

        const worldX = (centerX - this.panX) / this.scale;
        const worldY = (centerY - this.panY) / this.scale;

        this.scale = Math.max(0.1, this.scale - 0.1);
        this.panX = centerX - worldX * this.scale;
        this.panY = centerY - worldY * this.scale;

        this.render();
    };

    getZoomPercentage = () => {
        return Math.round(this.scale * 100);
    };

    setZoomPercentage = () => {
        this.setZoomValue(Math.round(this.scale * 100));
    };

    initEvents = () => {
        this.canvas.addEventListener("mousedown", this.mouseDownHandler);
        this.canvas.addEventListener("mouseup", this.mouseUpHandler);
        this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
        this.canvas.addEventListener("wheel", this.wheelHandler, {
            passive: false,
        });
        this.socket.onmessage = this.onMessage;
    };

    cleanUpvents = () => {
        this.destroyed = true;
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
        this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
        this.canvas.removeEventListener("wheel", this.wheelHandler);
        this.socket.onmessage = null;
    };

    handleTextInput = (
        e: MouseEvent,
        worldCoords: { x: number; y: number },
        existingShape?: any,
    ) => {
        if (document.getElementById("canvas-text-input")) return;

        const textArea = document.createElement("textarea");
        textArea.id = "canvas-text-input";

        // --- POSITIONING ---
        // If editing, lock the textarea exactly to the existing shape's location
        // We use getBoundingClientRect() to account for where the canvas is on the screen
        const rect = this.canvas.getBoundingClientRect();
        let screenX = e.clientX;
        let screenY = e.clientY;

        if (existingShape) {
            textArea.value = existingShape.text;
            screenX = existingShape.x * this.scale + this.panX ;
            screenY = existingShape.y * this.scale + this.panY ;

            // UX Trick: Temporarily remove the shape from canvas while editing
            // so it doesn't look thick/doubled up behind the textarea
            this.existingShapes = this.existingShapes.filter(
                (shape) => shape.id !== existingShape.id,
            );
            this.render();
        }

        textArea.style.position = "fixed";
        textArea.style.left = `${screenX}px`;
        textArea.style.top = `${screenY}px`;
        textArea.style.margin = "0";
        textArea.style.padding = "0";
        textArea.style.border = "1px dashed #ccc";
        textArea.style.outline = "none";
        textArea.style.background = "transparent";
        textArea.style.color = colorMap[this.storkeColor];
        textArea.style.font = "24px sans-serif";
        textArea.style.zIndex = "1000";
        textArea.style.resize = "none";
        textArea.style.overflow = "hidden";
        textArea.style.whiteSpace = "pre";
        textArea.style.minWidth = "50px";
        textArea.style.minHeight = "24px";

        document.body.appendChild(textArea);
        setTimeout(() => textArea.focus(), 0);

        let isSubmitted = false;

        const submitText = () => {
            if (isSubmitted) return;
            isSubmitted = true;

            const text = textArea.value;
            textArea.remove();

            if (text.trim().length > 0) {
                if (existingShape) {
                    // --- UPDATE EXISTING ---
                    existingShape.text = text;
                    existingShape.storkeColor = colorMap[this.storkeColor]; // Update color to current
                    this.existingShapes.push(existingShape);

                    this.socket.send(
                        JSON.stringify({
                            type:"editText",
                            message:JSON.stringify({
                                id:existingShape.id,
                                shape: existingShape
                            }),
                            roomId: this.roomId
                        })
                    )

                    // // Broadcast the update (Erase old, draw new is the safest way to sync state)
                    // this.socket.send(
                    //     JSON.stringify({
                    //         type: "erase",
                    //         message: JSON.stringify({ id: existingShape.id, shape: existingShape }),
                    //         roomId: this.roomId,
                    //     }),
                    // );
                    // this.socket.send(
                    //     JSON.stringify({
                    //         type: "draw",
                    //         message: JSON.stringify(existingShape),
                    //         roomId: this.roomId,
                    //     }),
                    // );
                } else {
                    // --- CREATE NEW ---
                    const newShape: Shape = {
                        type: "text",
                        id: crypto.randomUUID(),
                        x: worldCoords.x,
                        y: worldCoords.y,
                        text: text,
                        storkeColor: colorMap[this.storkeColor],
                        storkeWidth: widthMap[this.storkeWidth],
                    };
                    this.existingShapes.push(newShape);

                    this.socket.send(
                        JSON.stringify({
                            type: "draw",
                            message: JSON.stringify(newShape),
                            roomId: this.roomId,
                        }),
                    );
                }
            } else if (existingShape && text.trim().length === 0) {
                // If user deleted all text during edit, treat it as deleting the shape
                this.socket.send(
                    JSON.stringify({
                        type: "erase",
                        message: JSON.stringify({ id: existingShape.id, shape: existingShape }),
                        roomId: this.roomId,
                    }),
                );
            }

            this.render();
        };

        textArea.addEventListener("blur", submitText);
        textArea.addEventListener("keydown", (keyEvent) => {
            if (keyEvent.key === "Enter" && !keyEvent.shiftKey) {
                keyEvent.preventDefault();
                submitText();
            }
            if (keyEvent.key === "Escape") {
                isSubmitted = true;
                textArea.remove();

                // If they cancelled an edit, put the original shape back untouched
                if (existingShape) {
                    this.existingShapes.push(existingShape);
                    this.render();
                }
            }
        });

        // Auto-resize textarea as user types
        const autoResize = () => {
            textArea.style.height = "auto";
            textArea.style.height = textArea.scrollHeight + "px";
            textArea.style.width = "auto";
            textArea.style.width = textArea.scrollWidth + "px";
        };
        textArea.addEventListener("input", autoResize);

        // Trigger resize immediately if pre-filled with existing text
        if (existingShape) autoResize();
    };
}
