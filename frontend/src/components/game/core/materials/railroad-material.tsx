import { TextureAssetTask } from "@babylonjs/core";
import { useAssetManager } from "react-babylonjs";
import { textureTasks } from "@/components/game/core/assets/tasks";
import { TextureRootUrl } from "@/components/game/core/constants/common";

export function RailroadMaterial() {
  const textures = useAssetManager(textureTasks, {
    useDefaultLoadingScreen: true
  });
  const railroadTexture = textures.taskNameMap["railroad"] as TextureAssetTask;

  return (
    <standardMaterial
      name="railroad-mat"
    >
      <texture
        assignTo="diffuseTexture"
        fromInstance={railroadTexture.texture}
        url={TextureRootUrl}
        hasAlpha
      />
    </standardMaterial>
  );
}