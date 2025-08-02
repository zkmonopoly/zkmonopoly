import { MeshAssetTask, AbstractMesh, Vector3 } from "@babylonjs/core";
import { useRef, useEffect } from "react";
import { useAssetManager } from "react-babylonjs";
import { textureTasks } from "./core/assets/tasks";
import { getRotation } from "./core/constants/rotations";
import { $house } from "@/models/property";
import { NodePositions } from "./core/constants/common";

export default function House() {
  const textures = useAssetManager(textureTasks, {
    useDefaultLoadingScreen: true,
  });
  const houseTexture = textures.taskNameMap["house"] as MeshAssetTask;
  const houseBufferRef = useRef<Map<number, AbstractMesh[]>>(new Map());

  useEffect(() => {
    $house.listen((house) => {
      if (house) {
        for (let i = 0; i < house.building; ++i) {
          let cache = houseBufferRef.current.get(house.position);
          if (!cache) {
            houseBufferRef.current.set(house.position, []);
            cache = houseBufferRef.current.get(house.position)!;
          }
          cache.forEach(mesh => mesh.dispose());
          const clone = houseTexture.loadedMeshes[0].clone(`${house.position}_house_${i}`, null)!;
          clone.scaling = new Vector3(2, 2, 2);
          clone.position = NodePositions[house.position].add(new Vector3(1 - i * 0.5, 0.5, -2).applyRotationQuaternion((getRotation(house.position / 10 + 1) ?? Vector3.Zero()).toQuaternion()));
          cache.push(clone);
        }
      }
    });
    
  }, []);

  return null;
}
