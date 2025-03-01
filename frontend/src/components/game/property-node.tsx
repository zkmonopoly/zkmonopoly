import { Color3, Vector3 } from "@babylonjs/core";
import { NodeMaterial } from "@/components/game/materials/node-material";
import { DefaultMeshOffset } from "@/components/game/constants/offsets";
import { JsText } from "./texts/js-text";
import { EdgeNode } from "./edge-node";

interface PropertyNodeProps {
    name: string
    position: Vector3
    color: Color3
    propertyName: string[]
    propertyValue: string
}

export function PropertyNode(props: PropertyNodeProps) {
    return (
        <EdgeNode
            name={props.name}
            position={props.position}
        >
            <ground
                name={`${props.name}-property-color`}
                position={props.position.add(new Vector3(0, 0.5 + DefaultMeshOffset, -2))}
                width={3}
                height={1}
            >
                <NodeMaterial color={props.color}/>
            </ground>
            <JsText
                name={`${props.name}-property-name`}
                text={props.propertyName}
                position={props.position.add(new Vector3(0, 0.5, -0.5))}
                rotation={new Vector3(Math.PI / 2, 0, Math.PI)}
                
            />
            <JsText
                name={`${props.name}-property-value`}
                text={[props.propertyValue]}
                position={props.position.add(new Vector3(0, 0.5, 2))}
                rotation={new Vector3(Math.PI / 2, 0, Math.PI)}
            />
        </EdgeNode>
    )
}