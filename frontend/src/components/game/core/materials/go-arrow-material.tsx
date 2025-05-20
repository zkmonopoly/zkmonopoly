import { TextureAssetTask } from "@babylonjs/core";
import { useAssetManager } from "react-babylonjs";
import { textureTasks } from "@/components/game/core/assets/tasks";
import { TextureRootUrl } from "@/components/game/core/constants/common";

export default function GoArrowMaterial() {
  const textures = useAssetManager(textureTasks, {
    useDefaultLoadingScreen: true
  });
  const goArrowTexture = textures.taskNameMap["go-arrow"] as TextureAssetTask;

  return (
    <standardMaterial
      name="go-arrow-mat"
    >
      <texture
        assignTo="diffuseTexture"
        fromInstance={goArrowTexture.texture}
        url={TextureRootUrl}
        hasAlpha
      />
    </standardMaterial>
  );
}