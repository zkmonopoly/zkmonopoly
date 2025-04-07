import { MeshAssetTask } from "@babylonjs/core";
import { useEffect } from "react";
import { useAssetManager, useScene } from "react-babylonjs";
import { textureTasks } from "./core/assets/tasks";
import { DiceRollerFactory } from "./core/utils/dice-roller";

interface DiceProps {
    diceIndex: number[];
}

export function Dice(props: DiceProps) {
    const scene = useScene();
    const textures = useAssetManager(textureTasks, {
        useDefaultLoadingScreen: true,
    });
    const diceTexture = textures.taskNameMap["dice"] as MeshAssetTask;

    useEffect(() => {
        if (scene && props.diceIndex && props.diceIndex.length > 0) {
            if (props.diceIndex[0] > 0 && props.diceIndex[1] > 0) {
                DiceRollerFactory.createFromLoadedMesh(
                    diceTexture.loadedMeshes[0],
                    scene
                ).then((diceRoller) => {
                    diceRoller.roll(props.diceIndex[0], props.diceIndex[1]);
                });
            }
        }
    }, [props]);

    return null;
}
