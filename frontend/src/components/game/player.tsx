import { AbstractMesh, MeshAssetTask, Vector3, StandardMaterial, Color3, Nullable } from "@babylonjs/core";
import { useEffect, useRef, useState } from "react"
import { useAssetManager, useBeforeRender, useScene } from "react-babylonjs";
import { textureTasks } from "./core/assets/tasks";
import { NodePositions, PlayerPositions } from "./core/constants/common";
import { MonopolyColors } from "./core/constants/colors";

interface PlayerProps {
    playerIndex: number;
}

export function Player(props: PlayerProps) {
    const scene = useScene();
    const textures = useAssetManager(textureTasks, {
        useDefaultLoadingScreen: true
    });
    const playerTexture = textures.taskNameMap["player"] as MeshAssetTask;
    const playerMeshRef = useRef<Nullable<AbstractMesh>>(null);
    // current cell index
    const [cellIndex, setCellIndex] = useState<number>(0);
    // old cell index
    const [oldCellIndex, setOldCellIndex] = useState<number>(NaN);
    const movementSequenceRef = useRef<number[]>([]);
    const positionRef = useRef<Vector3>(PlayerPositions[props.playerIndex]);

    // update cell index
    function updateCellIndex(newCellIndex: number) {
        setOldCellIndex(cellIndex);
        setCellIndex(newCellIndex);
    }

    // Calculate movement sequence
    useEffect(() => {
        const sequence: number[] = [];
        // calculate movement sequence
        sequence.push(cellIndex);
        // check for corner cases
        if (oldCellIndex < 30 && 30 < cellIndex) {
            sequence.push(30);
        }
        if (oldCellIndex < 20 && 20 < cellIndex) {
            sequence.push(20);
        }
        if (oldCellIndex < 10 && 10 < cellIndex) {
            sequence.push(10);
        }
        if (oldCellIndex < 0 && 0 < cellIndex) {
            sequence.push(0);
        }
        console.log(`Player ${props.playerIndex} movement sequence: ${sequence}`);
        movementSequenceRef.current = sequence;
    }, [cellIndex]);

    useBeforeRender((scene) => {
        if (scene && playerMeshRef.current) {
            if (!playerMeshRef.current.position.equals(positionRef.current)) {
                playerMeshRef.current.position = Vector3.Lerp(playerMeshRef.current.position, positionRef.current, 0.1);
                if (playerMeshRef.current.position.equalsWithEpsilon(positionRef.current, 0.1)) {
                    playerMeshRef.current.position = positionRef.current;
                }
            } else if (movementSequenceRef.current.length > 0) {
                const movement = movementSequenceRef.current.pop();
                if (movement) {
                    console.log(`Player ${props.playerIndex} moved to cell ${movement}`);
                    console.log(movementSequenceRef.current.length);
                    positionRef.current = NodePositions[movement].add(new Vector3(PlayerPositions[props.playerIndex].x, 0.5, PlayerPositions[props.playerIndex].z));
                }
            }
        }
    });

    // DEBUG: Move player every 3 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            updateCellIndex(35);
        }, 3000);
        return () => {
            clearTimeout(timer);
        }
    }, [cellIndex]);

    useEffect(() => {
        const scalingFactor = 2;
        const scale = new Vector3(scalingFactor, scalingFactor, scalingFactor);
        // if player index is 0, use the original mesh, otherwise clone it
        if (props.playerIndex === 0) {
            playerMeshRef.current = playerTexture.loadedMeshes[0];
        } else {
            playerMeshRef.current = playerTexture.loadedMeshes[0].clone(`player${props.playerIndex}`, null)!;
        }
        // set player mesh properties
        playerMeshRef.current.name = `player${props.playerIndex}`;
        playerMeshRef.current.position = PlayerPositions[props.playerIndex];
        playerMeshRef.current.scaling = scale;
        // set player material
        const playerMaterial = new StandardMaterial(`player${props.playerIndex}Material`, scene!);
        playerMaterial.specularColor = Color3.Black();
        switch (props.playerIndex) {
            case 0:
                playerMaterial.diffuseColor = MonopolyColors.Red;
                break;
            case 1:
                playerMaterial.diffuseColor = MonopolyColors.Yellow;
                break;
            case 2:
                playerMaterial.diffuseColor = MonopolyColors.Green;
                break;
            case 3:
                playerMaterial.diffuseColor = MonopolyColors.Blue;
                break;
        }
        playerMeshRef.current.getChildMeshes().forEach((mesh) => {
            mesh.material = playerMaterial;
        });
    }, []);

    return null;
}