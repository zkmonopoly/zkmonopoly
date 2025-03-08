import { TextureAssetTask } from "@babylonjs/core";
import { useAssetManager } from "react-babylonjs";
import { textureTasks } from "@/components/game/assets/tasks";
import { TextureRootUrl } from "@/components/game/constants/common";

export function ElectricCompanyMaterial() {
    const textures = useAssetManager(textureTasks, {
        useDefaultLoadingScreen: true
    });
    const electricCompanyTexture = textures.taskNameMap["electric-company"] as TextureAssetTask;

    return (
        <standardMaterial
            name="electric-company-mat"
        >
            <texture
                assignTo="diffuseTexture"
                fromInstance={electricCompanyTexture.texture}
                url={TextureRootUrl}
                hasAlpha
            />
        </standardMaterial>
    );
}