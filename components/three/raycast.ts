export type RayCastTarget = { distance: number; id: string };
export function findLowestDistance(a: RayCastTarget, b: RayCastTarget) {
    if (a.distance < b.distance) {
        return -1;
    }
    if (a.distance > b.distance) {
        return 1;
    }
    return 0;
}
