import { Color3 } from "@babylonjs/core";

interface TextMaterialProps {
    color?: Color3
}

export function TextMaterial({ color = Color3.Black() }: TextMaterialProps) {
  return (
    <standardMaterial
      name="text-mat"
      backFaceCulling
      diffuseColor={color}
      specularColor={Color3.Black()}
    />
  );
}