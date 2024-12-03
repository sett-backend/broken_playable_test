export enum Player {
    WHITE,
    BLACK,
    NONE,
}

export class Constants {
    static readonly boardSize = { x: 900, y: 759 };
    static readonly boardPointsCount = 24;
    static readonly checkerSize = 128;
    static readonly turnTimeLimit = 15; // seconds
}
