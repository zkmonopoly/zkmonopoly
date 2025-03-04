import { Vector3 } from "@babylonjs/core";
import { EdgeNode } from "./edge-node";
import { JsText } from "./texts/js-text";
import { DefaultMeshOffset } from "./constants/offsets";
import { RectangleDimensions } from "./constants/dimensions";
import { RailroadMaterial } from "./materials/railroad-material";
import { getRotation, getSpecialPropertyOffset } from "./constants/rotations";

interface RailroadNodeProps {
    name: string
    position: Vector3
    rotationIndex?: number
    propertyName: string[]
    propertyValue: string
}

export function RailroadNode({rotationIndex = 0, ...props}: RailroadNodeProps) {
    return (
        <EdgeNode
            name={props.name}
            position={props.position}
            rotation={getRotation(rotationIndex)}
        >
            <JsText
                name={`${props.name}-railroad-name`}
                text={props.propertyName}
                position={props.position}
                yOffset={0.5}
                xzOffset={-1.25}
                rotationIndex={rotationIndex}
            />
            <ground
                name={`${props.name}-railroad-image`}
                position={props.position.add(new Vector3(0, 0.5 + DefaultMeshOffset, 0)).add(getSpecialPropertyOffset(rotationIndex))}
                width={RectangleDimensions[1].width}
                height={RectangleDimensions[1].height}
                rotation={getRotation(rotationIndex + 2 % 4)}
            >
                <RailroadMaterial />
            </ground> 
            <JsText
                name={`${props.name}-property-value`}
                text={[props.propertyValue]}
                position={props.position}
                yOffset={0.5}
                xzOffset={1.825}
                rotationIndex={rotationIndex}
            />
        </EdgeNode>
    );
}