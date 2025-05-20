import { Color3, TextureAssetTask } from "@babylonjs/core";
import { useAssetManager } from "react-babylonjs";
import { textureTasks } from "@/components/game/core/assets/tasks";
import { NodeColor } from "@/components/game/core/constants/colors";
import { TextureRootUrl } from "@/components/game/core/constants/common";

interface NodeMaterialProps {
    color?: Color3
}

export default function NodeMaterial({ color = NodeColor }: NodeMaterialProps) {
  const textures = useAssetManager(textureTasks, {
    useDefaultLoadingScreen: true
  });
  const frameBorderTexture = textures.taskNameMap["frame-border"] as TextureAssetTask;
    
  return (
    <standardMaterial
      name="node-mat"
      backFaceCulling
      diffuseColor={color}
      specularColor={Color3.Black()}
    >
      <texture
        assignTo="diffuseTexture"
        fromInstance={frameBorderTexture.texture}
        url={TextureRootUrl}
      />
    </standardMaterial>
  );
}