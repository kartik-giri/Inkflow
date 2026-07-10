export enum Shapes {
    circle,
    rectangle,
    pencil,
    move,
    eraser,
    Hand,
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
        x: number;
        y: number;
        width: number;
        height: number;
        storkeWidth: number;
        storkeColor: string;
    }
    | {
        type: "circle";
        radius: number;
        centerX: number;
        centerY: number;
        storkeWidth: number;
        storkeColor: string;
    }
    | {
        type: "pencil";
        points: Points[];
        storkeWidth: number;
        storkeColor: string;
    };

export type Points = {
    x: number;
    y: number;
};