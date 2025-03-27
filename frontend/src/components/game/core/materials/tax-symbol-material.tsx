import { TextureAssetTask } from "@babylonjs/core";
import { useAssetManager } from "react-babylonjs";
import { textureTasks } from "../assets/tasks";
import { TextureRootUrl } from "../constants/common";

export function TaxSymbolMaterial() {
    const textures = useAssetManager(textureTasks, {
        useDefaultLoadingScreen: true
    });
    const taxSymbolTexture = textures.taskNameMap["tax-symbol"] as TextureAssetTask;

    return (
        <standardMaterial
            name="railroad-mat"
        >
            <texture
                assignTo="diffuseTexture"
                fromInstance={taxSymbolTexture.texture}
                url={TextureRootUrl}
                hasAlpha
            />
        </standardMaterial>
    );
}