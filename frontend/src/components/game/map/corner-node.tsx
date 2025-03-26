import { Vector3 } from "@babylonjs/core";
import { NodeMaterial } from "@/components/game/core/materials/node-material";
import { PropsWithChildren } from "react";

export interface CornerNodeProps extends PropsWithChildren {
    name: string
    position: Vector3
    rotation?: Vector3
}

export function CornerNode(props: CornerNodeProps) {
    return (
        <>
            <box
                name={props.name}
                position={props.position}
                rotation={props.rotation}
                scaling={new Vector3(5, 1, 5)}
            >
                <NodeMaterial />
            </box>
            {props.children}
        </>
    );
}