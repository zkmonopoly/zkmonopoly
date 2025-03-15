import { AbstractMesh, Color3, MeshAssetTask, Nullable, Vector3 } from "@babylonjs/core";
import { useEffect, useState } from "react"
import { StandardMaterial, useAssetManager } from "react-babylonjs";
import { textureTasks } from "./assets/tasks";

interface PlayerProps {
    position: Vector3;
}

export function Player(props: PlayerProps) {
    const textures = useAssetManager(textureTasks, {
        useDefaultLoadingScreen: true
    });
    const playerTexture = textures.taskNameMap["player"] as MeshAssetTask;
    const [playerMesh, setPlayerMesh] = useState<Nullable<AbstractMesh>>(null);
    const [money, setMoney] = useState<number>();
    const [position, setPosition] = useState<number>();
    const [jail, setJail] = useState<boolean>();
    const [properties, setProperties] = useState<string[]>()

    useEffect(() => {
        playerTexture.loadedMeshes[0].position = props.position;
        playerTexture.loadedMeshes[0].scaling = new Vector3(2, 2, 2);
        console.log(playerTexture.loadedMeshes[0].serialize());
    }, []);

    return null;
}