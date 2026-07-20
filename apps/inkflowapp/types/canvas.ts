export enum Shapes {
    circle,
    rectangle,
    pencil,
    diamond,
    Line,
    Arrow,
    text,
    move,
    eraser,
    Hand,
    Pointer
}

export enum StorkeColor {
    black,
    orange,
    indigo,
    yellow,
    green,
    blue,
}

export enum StorkeWidth {
    mini,
    small,
    large,
    xLarge,
}

export type Shape =
    | {
        type: "rect";
        id: string;
        x: number;
        y: number;
        width: number;
        height: number;
        storkeWidth: number;
        storkeColor: string;
    }
    | {
        type: "circle";
        id: string;
        x: number,
        y: number,
        width: number,
        height: number,
        storkeWidth: number;
        storkeColor: string;
    }
    | {
        type: "pencil";
        id: string;
        points: Points[];
        storkeWidth: number;
        storkeColor: string;
    } | {
        type: "diamond",
        id: string;
        x: number,
        y: number,
        width: number,
        height: number,
        storkeColor: string,
        storkeWidth: number
    } | {
        type: "line",
        id: string;
        startX: number,
        startY: number,
        endX: number,
        endY: number,
        storkeColor: string,
        storkeWidth: number
    } | {
        type: "arrow",
        id: string;
        startX: number,
        startY: number,
        endX: number,
        endY: number,
        storkeColor: string,
        storkeWidth: number
    } | {
        type: "text",
        id: string;
        x: number,
        y: number,
        text: string,
        storkeWidth: number,
        storkeColor: string,
    }

export type Points = {
    x: number;
    y: number;
};