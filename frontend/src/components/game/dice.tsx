import { MeshAssetTask } from "@babylonjs/core";
import { atom } from "nanostores";
import { useEffect } from "react";
import { useAssetManager, useScene } from "react-babylonjs";
import { textureTasks } from "./core/assets/tasks";
import { DiceRollerFactory } from "./core/utils/dice-roller";

export const $dices = atom<number[]>([]);

export function Dice() {
    const scene = useScene();
    const textures = useAssetManager(textureTasks, {
        useDefaultLoadingScreen: true,
    });
    const diceTexture = textures.taskNameMap["dice"] as MeshAssetTask;

    useEffect(() => {
        if (scene) {
            DiceRollerFactory.createFromLoadedMesh(
                diceTexture.loadedMeshes[0],
                scene
            ).then((diceRoller) => {
                $dices.listen((values) => {
                    diceRoller.roll(values[0], values[1]);
                });
            });
        }
    }, []);

    return null;
}
