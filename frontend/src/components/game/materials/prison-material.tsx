import { Color3, TextureAssetTask } from "@babylonjs/core";
import { useAssetManager } from "react-babylonjs";
import { textureTasks } from "@/components/game/assets/tasks";

export function PrisonMaterial() {
    const textures = useAssetManager(textureTasks, {
        useDefaultLoadingScreen: true
    });
    const prisonTexture = textures.taskNameMap["prison"] as TextureAssetTask;


    return (
        <standardMaterial
            name="text-mat"
        >
            <texture
                assignTo="diffuseTexture"
                fromInstance={prisonTexture.texture}
                url="rootUrl"
                hasAlpha
            />
        </standardMaterial>
    );
}