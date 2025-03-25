import { MeshAssetTask } from "@babylonjs/core";
import { useEffect } from "react";
import { useAssetManager, useScene } from "react-babylonjs";
import { textureTasks } from "./assets/tasks";
import { DiceRollerFactory } from "./utils/roll-dice";

export function Dice() {
    const scene = useScene();
    const textures = useAssetManager(textureTasks, {
        useDefaultLoadingScreen: true
    });
    const diceTexture = textures.taskNameMap["dice"] as MeshAssetTask;

    useEffect(() => {
        if (scene) {
            DiceRollerFactory.createFromLoadedMesh(diceTexture.loadedMeshes[0], scene).then((diceRoller) => {
                diceRoller.roll(1, 1);
            });
        }
    }, []);

    return null;
}