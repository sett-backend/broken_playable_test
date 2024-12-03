import { isNumber } from 'lodash';

export type Vector2D = { x: number; y: number };
export type Dimensions = { width: number; height: number };
export type Coordinate = [number, number];
export type BoundingRect = { x: number; y: number; width: number; height: number };
export type Rect = { top: number; left: number; bottom: number; right: number };

export function setCoordinate(x: number, y: number) {
    return [x, y] as Coordinate;
}
export const emptyRect = { top: 0, left: 0, bottom: 0, right: 0 };
export type XY = { x: number; y: number };

export class Position {
    x: number;
    y: number;
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    add(position: { x: number; y: number }) {
        this.x += position.x;
        this.y += position.y;
    }
    set(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    get() {
        return { x: this.x, y: this.y };
    }
    toCoordinate() {
        return setCoordinate(this.x, this.y);
    }
    setX(x: number) {
        this.set(x, this.y);
        return this.get();
    }
    setY(y: number) {
        this.set(this.x, y);
        return this.get();
    }
    map(pos: { x: number; y: number }) {
        this.set(pos.x, pos.y);
    }
    reset() {
        this.set(0, 0);
    }
    log() {
        return `x: ${this.x} y: ${this.y}`;
    }

    subtract(position: { x: number; y: number }) {
        this.x -= position.x;
        this.y -= position.y;
    }
}
