import { Vector3 } from "@babylonjs/core";
import { DefaultMeshOffset } from "../core/constants/offsets";
import { JsText } from "../core/texts/js-text";
import { CornerNode, CornerNodeProps } from "./corner-node";
import { FreeParkingMaterial } from "../core/materials/free-parking-material";
import { RectangleDimensions } from "../core/constants/dimensions";

interface FreeParkingNodeProps extends Omit<CornerNodeProps, "children"> {}

export function FreeParkingNode(props: FreeParkingNodeProps) {
  return (
    <CornerNode
      name={props.name}
      position={props.position}
    >
      <ground
        name={`${props.name}-image`}
        position={props.position.add(new Vector3(-0.25, 0.5 + DefaultMeshOffset, 0.25))}
        rotation={new Vector3(0, Math.PI * 7 / 4, 0)}
        width={RectangleDimensions[4].width}
        height={RectangleDimensions[4].height}
      >
        <FreeParkingMaterial />
      </ground>
      <JsText
        name={`${props.name}-free`}
        text={["FREE"]}
        position={props.position.add(new Vector3(-1.125, 0.5, 1.375))}
        fontScale={2}
        rotation={new Vector3(Math.PI / 2, Math.PI * 3 / 4, Math.PI)}
      />
      <JsText
        name={`${props.name}-parking`}
        text={["PARKING"]}
        position={props.position.add(new Vector3(1, 0.5, -0.75))}
        fontScale={2}
        rotation={new Vector3(Math.PI / 2, Math.PI * 3 / 4, Math.PI)}
      />
    </CornerNode>
  );
}