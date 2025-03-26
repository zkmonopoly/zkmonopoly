import { TextureAssetTask } from "@babylonjs/core";
import { useAssetManager } from "react-babylonjs";
import { textureTasks } from "@/components/game/core/assets/tasks";
import { TextureRootUrl } from "@/components/game/core/constants/common";

export function FreeParkingMaterial() {
    const textures = useAssetManager(textureTasks, {
        useDefaultLoadingScreen: true
    });
    const freeParkingTexture = textures.taskNameMap["free-parking"] as TextureAssetTask;

    return (
        <standardMaterial
            name="free-parking-mat"
        >
            <texture
                assignTo="diffuseTexture"
                fromInstance={freeParkingTexture.texture}
                url={TextureRootUrl}
                hasAlpha
            />
        </standardMaterial>
    );
}