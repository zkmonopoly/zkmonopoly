import { Color3, TextureAssetTask } from "@babylonjs/core";
import { useAssetManager } from "react-babylonjs";
import { textureTasks } from "@/components/game/assets/tasks";
import { NodeColor } from "@/components/game/constants/colors";

interface NodeMaterialProps {
    color?: Color3
}

export function NodeMaterial({ color = NodeColor }: NodeMaterialProps) {
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
                url="rootUrl"
            />
        </standardMaterial>
    );
}