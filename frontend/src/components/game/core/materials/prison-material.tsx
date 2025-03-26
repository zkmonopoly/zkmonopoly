import { TextureAssetTask } from "@babylonjs/core";
import { useAssetManager } from "react-babylonjs";
import { textureTasks } from "@/components/game/core/assets/tasks";
import { TextureRootUrl } from "@/components/game/core/constants/common";

export function PrisonMaterial() {
    const textures = useAssetManager(textureTasks, {
        useDefaultLoadingScreen: true
    });
    const prisonTexture = textures.taskNameMap["prison"] as TextureAssetTask;

    return (
        <standardMaterial
            name="prison-mat"
        >
            <texture
                assignTo="diffuseTexture"
                fromInstance={prisonTexture.texture}
                url={TextureRootUrl}
                hasAlpha
            />
        </standardMaterial>
    );
}