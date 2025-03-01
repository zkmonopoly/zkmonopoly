import { Vector3 } from "@babylonjs/core";
import { CornerNode } from "./corner-node";
import { DefaultMeshOffset } from "./constants/offsets";
import { NodeMaterial } from "./materials/node-material";
import { MonopolyColors } from "./constants/colors";
import { JsText } from "./texts/js-text";
import { PrisonMaterial } from "./materials/prison-material";

interface JailNodeProps {
    name: string
    position: Vector3
}

export function JailNode(props: JailNodeProps) {
    return (
        <CornerNode
            name={props.name}
            position={props.position}
        >
            <ground
                name={`${props.name}-in-jail`}
                position={props.position.add(new Vector3(0.75, 0.5 + DefaultMeshOffset, -0.75))}
                width={3.5}
                height={3.5}
            >
                <NodeMaterial color={MonopolyColors.Orange}/>
            </ground>
            <ground
                name={`${props.name}-prison`}
                position={props.position.add(new Vector3(0.75, 0.5 + DefaultMeshOffset * 2, -0.75))}
                rotation={new Vector3(0, Math.PI * 3 / 4, 0)}
                width={1.5}
                height={1.5}
            >
                <PrisonMaterial/>
            </ground>
            <JsText
                name={`${props.name}-just`}
                text={["JUST"]}
                position={props.position.add(new Vector3(1.25, 0.5, 2))}
                rotation={new Vector3(Math.PI / 2, 0, Math.PI)}
                fontScale={2}
            />
            <JsText
                name={`${props.name}-visiting`}
                text={["VISITING"]}
                position={props.position.add(new Vector3(-2, 0.5, -0.5))}
                rotation={new Vector3(Math.PI / 2, Math.PI, Math.PI / 2)}
                fontScale={2}
            />
            <JsText
                name={`${props.name}-in`}
                text={["IN"]}
                position={props.position.add(new Vector3(1.5, 0.5, -1.5))}
                rotation={new Vector3(Math.PI / 2, Math.PI * 5 / 4, Math.PI / 2)}
                fontScale={2}
            />
            <JsText
                name={`${props.name}-jail`}
                text={["JAIL"]}
                position={props.position.add(new Vector3(-0.375, 0.5, 0.375))}
                rotation={new Vector3(Math.PI / 2, Math.PI * 5 / 4, Math.PI / 2)}
                fontScale={2}
            />
        </CornerNode>
    );
}