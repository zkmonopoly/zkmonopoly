import { TextureAssetTask } from "@babylonjs/core";
import { useAssetManager } from "react-babylonjs";
import { textureTasks } from "@/components/game/assets/tasks";
import { TextureRootUrl } from "@/components/game/constants/common";

export function WaterCompanyMaterial() {
    const textures = useAssetManager(textureTasks, {
        useDefaultLoadingScreen: true
    });
    const waterCompanyTexture = textures.taskNameMap["water-company"] as TextureAssetTask;

    return (
        <standardMaterial
            name="water-company-mat"
        >
            <texture
                assignTo="diffuseTexture"
                fromInstance={waterCompanyTexture.texture}
                url={TextureRootUrl}
                hasAlpha
            />
        </standardMaterial>
    );
}