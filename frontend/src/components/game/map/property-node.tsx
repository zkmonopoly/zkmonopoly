import { Color3, Vector3 } from "@babylonjs/core";
import NodeMaterial from "@/components/game/core/materials/node-material";
import { DefaultMeshOffset } from "@/components/game/core/constants/offsets";
import JsText from "../core/texts/js-text";
import EdgeNode from "./edge-node";
import { getRotation } from "../core/constants/rotations";

interface PropertyNodeProps {
    name: string
    position: Vector3
    rotationIndex?: number
    color: Color3
    propertyName: string[]
    propertyValue: string
}

export default function PropertyNode({ rotationIndex = 0, ...props }: PropertyNodeProps) {
  return (
    <EdgeNode
      name={props.name}
      position={props.position}
      rotation={getRotation(rotationIndex)}
    >
      <ground
        name={`${props.name}-property-color`}
        position={props.position.add(new Vector3(0, 0.5 + DefaultMeshOffset, -2).applyRotationQuaternion((getRotation(rotationIndex) ?? Vector3.Zero()).toQuaternion()))}
        rotation={getRotation(rotationIndex)}
        width={3}
        height={1}
      >
        <NodeMaterial color={props.color}/>
      </ground>
      <JsText
        name={`${props.name}-property-name`}
        text={props.propertyName}
        position={props.position}
        yOffset={0.5}
        xzOffset={-0.5}
        rotationIndex={rotationIndex}
      />
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