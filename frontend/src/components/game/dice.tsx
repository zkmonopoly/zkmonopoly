import { MeshAssetTask } from "@babylonjs/core";
import { useEffect } from "react";
import { useAssetManager, useScene } from "react-babylonjs";
import { textureTasks } from "./core/assets/tasks";
import { DiceRollerFactory } from "./core/utils/dice-roller";

export function Dice() {
    const scene = useScene();
    const textures = useAssetManager(textureTasks, {
        useDefaultLoadingScreen: true
    });
    const diceTexture = textures.taskNameMap["dice"] as MeshAssetTask;

    useEffect(() => {
        if (scene) {
            DiceRollerFactory.createFromLoadedMesh(diceTexture.loadedMeshes[0], scene).then((diceRoller) => {
                diceRoller.roll(3, 1);
            });
        }
    }, []);

    return null;
}