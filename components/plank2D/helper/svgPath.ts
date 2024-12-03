import * as pl from 'planck-js';
import * as PIXI from 'pixi.js';

export const Vec2 = pl.Vec2;
export type Vec2Type = pl.Vec2;

export function loadSvg(raw: PIXI.TextureSource) {
    const base = raw.toString().split('data:image/svg+xml;base64,')[1];
    const svg = window.atob(base);
    return new window.DOMParser().parseFromString(svg, 'image/svg+xml');
}
export function getPathsFromSVG(rootSVG: Document): HTMLElement[] {
    return Array.prototype.slice.call(rootSVG.querySelectorAll('path'));
}

export function getPointsFromSVGPath(path: HTMLElement) {
    const points = [] as Vec2Type[];
    let lastPoint = Vec2(0, 0);

    try {
        const pathArray = path.getAttribute('d').toLowerCase().split('l');
        pathArray.forEach((point, index) => {
            if (index === 0) {
                point = point.replace('m', '');
            }
            if (index === pathArray.length - 1) {
                point = point.replace('z', '');
            }

            const position = point.split(',').map((point) => parseFloat(point));

            const newVector =
                index === 0
                    ? Vec2(position[0], position[1])
                    : Vec2(lastPoint.x + position[0], lastPoint.y + position[1]);

            points.push(newVector);

            lastPoint = newVector;
        });
    } catch (error) {
        console.error('Invalid SVG path');
    }
    return points;
}
