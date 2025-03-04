import { Vector3 } from "@babylonjs/core";

// counterclockwise rotations for each piece
const Rotations: Record<number, Vector3> = {
    1: new Vector3(0, Math.PI / 2, 0),
    2: new Vector3(0, Math.PI, 0),
    3: new Vector3(0, 3 * Math.PI / 2, 0)
}

export function getTextOffset(index: number, rotationIndex: number, yOffset: number, xzOffset: number, xzInvertOffset: number): Vector3 {
    index -= 0.5;
    switch (rotationIndex) {
        case 1:
            return new Vector3(0.5 * index + xzOffset, yOffset, xzInvertOffset);
        case 2:
            return new Vector3(xzInvertOffset, yOffset, -0.5 * index + xzOffset);
        case 3:
            return new Vector3(-0.5 * index + xzOffset, yOffset, xzInvertOffset);
        default:
            return new Vector3(xzInvertOffset, yOffset, 0.5 * index + xzOffset);
    }
}

export function getTextRotation(rotationIndex: number): Vector3 {
    switch (rotationIndex) {
        case 1:
            return new Vector3(Math.PI / 2, Math.PI / 2, Math.PI);
        case 2:
            return new Vector3(Math.PI / 2, 3 * Math.PI / 2, Math.PI);
        case 3:
            return new Vector3(Math.PI / 2, 2 * Math.PI, Math.PI);
        default:
            return new Vector3(Math.PI / 2, 0, Math.PI);
    }
}

export function getRotation(rotationIndex: number): Vector3 {
    return Rotations[rotationIndex];
}

export function getSpecialPropertyOffset(rotationIndex: number): Vector3 {
    switch (rotationIndex) {
        case 1:
            return new Vector3(0.25, 0, 0);
        case 2:
            return new Vector3(-0.25, 0, 0);
        case 3:
            return new Vector3(0, 0, -0.25);
        default:
            return new Vector3(0, 0, 0.25);
    }
}