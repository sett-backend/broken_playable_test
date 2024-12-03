import { Position, setCoordinate } from 'components/types';

export function degreesToRadians(degrees: number) {
    if (degrees) {
        return (degrees * Math.PI) / 180;
    }
    return 0;
}
export function calcAngleDegrees(x: number, y: number) {
    return radiansToDegrees(calcAngle(x, y));
}
export function calcAngle(x: number, y: number) {
    return Math.atan2(y, x);
}
export function radiansToDegrees(radian: number) {
    if (radian) {
        return (radian * 180) / Math.PI;
    }
    return 0;
}

export function lerp(min: number, max: number, value: number, trim = true) {
    let returnValue = 0;

    if (value > 1 && trim) return max;
    if (value < 0 && trim) return min;

    const range = Math.abs(max - min);
    const addedValue = range * value * (max > min ? 1 : -1);
    returnValue = min + addedValue;
    return returnValue;
}

export function moveTowards(from: number, to: number, delta: number) {
    const diff = to - from;
    if (Math.abs(diff) <= delta) {
        return to;
    }
    return diff > 0 ? from + delta : from - delta;
}

export function easeInBackOut(prc: number) {
    return (1 - Math.cos(prc * Math.PI * 2)) / 2;
}
export function easeInOut(prc: number) {
    return (1 - Math.cos(prc * Math.PI)) / 2;
}
export const getVectorEndPoint = (xCoord: number, yCoord: number, angle: number, length: number) => {
    const radiansAngle = degreesToRadians(angle);
    return setCoordinate(length * Math.cos(radiansAngle) + xCoord, length * Math.sin(radiansAngle) + yCoord);
};
export function addPosition(a: Position, b: Position) {
    return {
        x: a.x + b.x,
        y: a.y + b.y,
    };
}
