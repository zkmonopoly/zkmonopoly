import { MeshAssetTask, AbstractMesh, Vector3 } from "@babylonjs/core";
import { useRef, useEffect } from "react";
import { useAssetManager } from "react-babylonjs";
import { textureTasks } from "./core/assets/tasks";
import { getRotation } from "./core/constants/rotations";

export default function House() {
  const textures = useAssetManager(textureTasks, {
    useDefaultLoadingScreen: true,
  });
  const houseTexture = textures.taskNameMap["house"] as MeshAssetTask;
  const houseRef = useRef<AbstractMesh[]>([]);

  useEffect(() => {
    // houseRef.current.forEach(mesh => mesh.dispose())
    // houseRef.current = []
    // for (let i = 0; i < houses; ++i) {
    //   const clone = houseTexture.loadedMeshes[0].clone(`${propertyName}_house_${i}`, null)!;
    //   clone.scaling = new Vector3(2, 2, 2);
    //   clone.position = position.add(new Vector3(1 - i * 0.5, 0.5, -2).applyRotationQuaternion((getRotation(rotationIndex) ?? Vector3.Zero()).toQuaternion()));
    //   houseRef.current.push(clone)
    // }
  }, []);

  return null;
}
