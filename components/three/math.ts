import { Vector3 } from 'three';

export function addVectors(v1: Vector3, v2: Vector3) {
    return new Vector3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
}
export function equalVectors(v1: Vector3, v2: Vector3) {
    return v1.x === v2.x && v1.y === v2.y && v1.z === v2.z;
}
export function inverseVector(v1: Vector3, inverse = 1) {
    return new Vector3(v1.x * inverse, v1.y, v1.z * inverse);
}
