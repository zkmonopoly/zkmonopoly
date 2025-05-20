import { Vector3 } from "@babylonjs/core";
import { CornerNode, CornerNodeProps } from "./corner-node";
import JsText from "../core/texts/js-text";
import { GoArrowMaterial } from "../core/materials/go-arrow-material";
import { RectangleDimensions } from "../core/constants/dimensions";
import { DefaultMeshOffset } from "../core/constants/offsets";

interface GoNodeProps extends Omit<CornerNodeProps, "children"> {}

export default function GoNode(props: GoNodeProps) {
  return (
    <CornerNode {...props}>
      <JsText
        name={`${props.name}-go-text-collect`}
        text={["COLLECT"]}
        position={props.position}
        yOffset={0.5}
        xzOffset={-1}
        xzInvertOffset={1.25}
        rotation={new Vector3(Math.PI / 2, Math.PI * 5 / 4, Math.PI / 2)}
      />
      <JsText
        name={`${props.name}-go-text-salary`}
        text={["$200 SALARY"]}
        position={props.position}
        yOffset={0.5}
        xzOffset={-0.625}
        xzInvertOffset={1}
        rotation={new Vector3(Math.PI / 2, Math.PI * 5 / 4, Math.PI / 2)}
      />
      <JsText
        name={`${props.name}-go-text-as-you-pass`}
        text={["AS YOU PASS"]}
        position={props.position}
        yOffset={0.5}
        xzOffset={-0.375}
        xzInvertOffset={0.75}
        rotation={new Vector3(Math.PI / 2, Math.PI * 5 / 4, Math.PI / 2)}
      />
      <JsText
        name={`${props.name}-go-text-go`}
        text={["GO"]}
        position={props.position}
        fontScale={5}
        yOffset={0.5}
        xzOffset={0.5}
        xzInvertOffset={-0.375}
        rotation={new Vector3(Math.PI / 2, Math.PI * 5 / 4, Math.PI / 2)}
      />
      <ground
        name={`${props.name}-go-image`}
        position={props.position.add(new Vector3(0, 0.5 + DefaultMeshOffset, 1.375))}
        width={RectangleDimensions[3].width}
        height={RectangleDimensions[3].height}
        rotation={new Vector3(0, Math.PI, 0)}
      >
        <GoArrowMaterial/>
      </ground>
    </CornerNode>
  );
}