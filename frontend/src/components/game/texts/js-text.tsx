import { Vector3 } from "@babylonjs/core";
import earcut from "earcut";
import * as fontData from "@/components/game/assets/josefin_sans_regular.json";
import { TextMaterial } from "@/components/game/materials/text-material";

interface JsTextProps {
    name: string
    text: string[]
    position: Vector3
    rotation: Vector3
    fontScale?: number
}

export function JsText({ fontScale = 1, ...props }: JsTextProps) {
    return (
        props.text.map((line, index) => (
            <babylon-text
                key={index}
                name={`${props.name}-${index}`}
                text={line}
                fontData={fontData}
                size={0.25 * fontScale}
                depth={0.05}
                earcutInjection={earcut}
                position={props.position.add(new Vector3(0, 0, 0.5 * index))}
                rotation={props.rotation}
            >
                <TextMaterial />
            </babylon-text>
        ))
    )
}