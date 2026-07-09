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
    }
    | {
        type: "circle";
        radius: number;
        centerX: number;
        centerY: number;
    }
    | {
        type: "pencil";
        points: Points[];
    };

    export type Points = {
  x: number;
  y: number;
};