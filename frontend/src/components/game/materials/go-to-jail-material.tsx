import { TextureAssetTask } from "@babylonjs/core";
import { useAssetManager } from "react-babylonjs";
import { textureTasks } from "@/components/game/assets/tasks";
import { TextureRootUrl } from "@/components/game/constants/common";

export function GoToJailMaterial() {
    const textures = useAssetManager(textureTasks, {
        useDefaultLoadingScreen: true
    });
    const goToJailTexture = textures.taskNameMap["go-to-jail"] as TextureAssetTask;

    return (
        <standardMaterial
            name="go-to-jail-mat"
        >
            <texture
                assignTo="diffuseTexture"
                fromInstance={goToJailTexture.texture}
                url={TextureRootUrl}
                hasAlpha
            />
        </standardMaterial>
    );
}