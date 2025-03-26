import { TextureAssetTask } from "@babylonjs/core";
import { useAssetManager } from "react-babylonjs";
import { textureTasks } from "@/components/game/core/assets/tasks";
import { TextureRootUrl } from "@/components/game/core/constants/common";

export function LuxuryTaxMaterial() {
    const textures = useAssetManager(textureTasks, {
        useDefaultLoadingScreen: true
    });
    const luxuryTaxTexture = textures.taskNameMap["luxury-tax"] as TextureAssetTask;

    return (
        <standardMaterial
            name="luxury-tax-mat"
        >
            <texture
                assignTo="diffuseTexture"
                fromInstance={luxuryTaxTexture.texture}
                url={TextureRootUrl}
                hasAlpha
            />
        </standardMaterial>
    );
}