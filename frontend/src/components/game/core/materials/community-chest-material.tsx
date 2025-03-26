import { TextureAssetTask } from "@babylonjs/core";
import { useAssetManager } from "react-babylonjs";
import { textureTasks } from "@/components/game/core/assets/tasks";
import { TextureRootUrl } from "@/components/game/core/constants/common";

export function CommunityChestMaterial() {
    const textures = useAssetManager(textureTasks, {
        useDefaultLoadingScreen: true
    });
    const communityChestTexture = textures.taskNameMap["community-chest"] as TextureAssetTask;

    return (
        <standardMaterial
            name="community-chest-mat"
        >
            <texture
                assignTo="diffuseTexture"
                fromInstance={communityChestTexture.texture}
                url={TextureRootUrl}
                hasAlpha
            />
        </standardMaterial>
    );
}