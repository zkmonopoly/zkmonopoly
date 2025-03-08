import { TextureAssetTask } from "@babylonjs/core";
import { useAssetManager } from "react-babylonjs";
import { textureTasks } from "@/components/game/assets/tasks";
import { TextureRootUrl } from "@/components/game/constants/common";

export function GoArrowMaterial() {
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