import { Vector3 } from "@babylonjs/core";
import { DefaultMeshOffset } from "../core/constants/offsets";
import { JsText } from "../core/texts/js-text";
import { CornerNode, CornerNodeProps } from "./corner-node";
import { RectangleDimensions } from "../core/constants/dimensions";
import { GoToJailMaterial } from "../core/materials/go-to-jail-material";

interface GoToJailNodeProps extends Omit<CornerNodeProps, "children"> {}

export function GoToJailNode(props: GoToJailNodeProps) {
  return (
    <CornerNode
      name={props.name}
      position={props.position}
    >
      <ground
        name={`${props.name}-image`}
        position={props.position.add(new Vector3(0.25, 0.5 + DefaultMeshOffset, -0.125))}
        rotation={new Vector3(0, Math.PI / 4, 0)}
        width={RectangleDimensions[5].width}
        height={RectangleDimensions[5].height}
      >
        <GoToJailMaterial />
      </ground>
      <JsText
        name={`${props.name}-go-to`}
        text={["GO TO"]}
        position={props.position.add(new Vector3(1, 0.5, 1.25))}
        fontScale={2}
        rotation={new Vector3(Math.PI / 2, Math.PI * 5 / 4, Math.PI)}
      />
      <JsText
        name={`${props.name}-jail`}
        text={["JAIL"]}
        position={props.position.add(new Vector3(-1.5, 0.5, -1.25))}
        fontScale={2}
        rotation={new Vector3(Math.PI / 2, Math.PI * 5 / 4, Math.PI)}
      />
    </CornerNode>
  );
}