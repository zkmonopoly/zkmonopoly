import { Color3, Vector3 } from "@babylonjs/core";
import earcut from "earcut";
import * as fontData from "@/components/game/core/assets/josefin_sans_regular.json";
import { TextMaterial } from "@/components/game/core/materials/text-material";
import { getTextOffset, getTextRotation } from "../constants/rotations";

interface JsTextProps {
    name: string
    text: string[]
    position: Vector3
    rotation?: Vector3
    color?: Color3
    yOffset?: number
    xzOffset?: number
    xzInvertOffset?: number
    // if rotation is not provided, the text will apply rotationIndex instead
    rotationIndex?: number
    fontScale?: number
}

export function JsText({ yOffset = 0, xzOffset = 0, xzInvertOffset = 0, rotationIndex = 0, fontScale = 1, ...props }: JsTextProps) {
  return (
    props.text.map((line, index) => (
      <babylon-text
        key={index}
        name={`${props.name}-${index}`}
        text={line}
        fontData={fontData}
        size={0.24 * fontScale}
        depth={0.05}
        earcutInjection={earcut}
        position={props.position.add(getTextOffset(index, rotationIndex, yOffset, xzOffset, xzInvertOffset))}
        rotation={props.rotation ?? getTextRotation(rotationIndex)}
      >
        <TextMaterial color={props.color}/>
      </babylon-text>
    ))
  );
}