import { Vector3 } from "@babylonjs/core";
import { NodeMaterial } from "@/components/game/materials/node-material";
import { PropsWithChildren } from "react";

interface EdgeNodeProps extends PropsWithChildren {
    name: string
    position: Vector3
}

export function EdgeNode(props: EdgeNodeProps) {
    return (
        <>
            <box
                name={props.name}
                position={props.position}
                scaling={new Vector3(3, 1, 5)}
            >
                <NodeMaterial />
            </box>
            {props.children}
        </>
    )
}