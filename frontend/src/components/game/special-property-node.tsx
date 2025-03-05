import { PropsWithChildren } from "react";
import { Vector3 } from "@babylonjs/core";
import { EdgeNode } from "./edge-node";
import { JsText } from "./texts/js-text";
import { DefaultMeshOffset } from "./constants/offsets";
import { getRotation, getSpecialPropertyOffset } from "./constants/rotations";

interface RailroadNodeProps extends PropsWithChildren {
    name: string
    position: Vector3
    rotationIndex?: number
    propertyName: string[]
    propertyValue: string
    width: number
    height: number
}

export function SpecialPropertyNode({rotationIndex = 0, ...props}: RailroadNodeProps) {
    return (
        <EdgeNode
            name={props.name}
            position={props.position}
            rotation={getRotation(rotationIndex)}
        >
            <JsText
                name={`${props.name}-special-property-name`}
                text={props.propertyName}
                position={props.position}
                yOffset={0.5}
                xzOffset={-1.25}
                rotationIndex={rotationIndex}
            />
            <ground
                name={`${props.name}-special-property-image`}
                position={props.position.add(new Vector3(0, 0.5 + DefaultMeshOffset, 0)).add(getSpecialPropertyOffset(rotationIndex))}
                width={props.width}
                height={props.height}
                rotation={getRotation((rotationIndex + 2) % 4)}
            >
                {props.children}
            </ground> 
            <JsText
                name={`${props.name}-special-property-value`}
                text={[props.propertyValue]}
                position={props.position}
                yOffset={0.5}
                xzOffset={1.825}
                rotationIndex={rotationIndex}
            />
        </EdgeNode>
    );
}