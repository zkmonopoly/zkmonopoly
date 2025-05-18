import { Vector3 } from "@babylonjs/core";
import { CornerNode, CornerNodeProps } from "./corner-node";
import { DefaultMeshOffset } from "../core/constants/offsets";
import { NodeMaterial } from "../core/materials/node-material";
import { MonopolyColors } from "../core/constants/colors";
import { JsText } from "../core/texts/js-text";
import { PrisonMaterial } from "../core/materials/prison-material";

export function JailNode(props: CornerNodeProps) {
  return (
    <CornerNode
      name={props.name}
      position={props.position}
      rotation={props.rotation}
    >
      <ground
        name={`${props.name}-text-in-jail`}
        position={props.position.add(new Vector3(-0.75, 0.5 + DefaultMeshOffset, -0.75))}
        width={3.5}
        height={3.5}
      >
        <NodeMaterial color={MonopolyColors.Orange}/>
      </ground>
      <ground
        name={`${props.name}-prison`}
        position={props.position.add(new Vector3(-0.75, 0.5 + DefaultMeshOffset * 2, -0.75))}
        rotation={new Vector3(0, Math.PI * 5 / 4, 0)}
        width={1.5}
        height={1.5}
      >
        <PrisonMaterial/>
      </ground>
      <JsText
        name={`${props.name}-text-just`}
        text={["JUST"]}
        position={props.position.add(new Vector3(2, 0.5, -1))}
        rotation={new Vector3(Math.PI / 2, 2 * Math.PI, Math.PI / 2)}
        fontScale={2}
      />
      <JsText
        name={`${props.name}-text-visiting`}
        text={["VISITING"]}
        position={props.position.add(new Vector3(-0.5, 0.5, 2.25))}
        rotation={new Vector3(Math.PI / 2, Math.PI * 3 / 2, Math.PI / 2)}
        fontScale={2}
      />
      <JsText
        name={`${props.name}-text-in`}
        text={["IN"]}
        position={props.position.add(new Vector3(-1.5, 0.5, -1.25))}
        rotation={new Vector3(Math.PI / 2, Math.PI * 7 / 4, Math.PI / 2)}
        fontScale={2}
      />
      <JsText
        name={`${props.name}-text-jail`}
        text={["JAIL"]}
        position={props.position.add(new Vector3(0.25, 0.5, 0.5))}
        rotation={new Vector3(Math.PI / 2, Math.PI * 7 / 4, Math.PI / 2)}
        fontScale={2}
      />
    </CornerNode>
  );
}