import { Vector3 } from "@babylonjs/core";
import { RectangleDimensions } from "./constants/dimensions";
import { DefaultMeshOffset } from "./constants/offsets";
import { getRotation, getSpecialPropertyOffset } from "./constants/rotations";
import { EdgeNode, EdgeNodeProps } from "./edge-node";
import { JsText } from "./texts/js-text";
import { ElectricCompanyMaterial } from "./materials/electric-company-material";

interface ElectricCompanyNodeProps extends Omit<EdgeNodeProps, "children" | "rotation"> {}

export function ElectricCompanyNode(props: ElectricCompanyNodeProps) {
    return (
        <EdgeNode
            name={props.name}
            position={props.position}
            rotation={getRotation(1)}
        >
            <JsText
                name={`${props.name}-electric-company-text`}
                text={["ELECTRIC", "COMPANY"]}
                position={props.position}
                yOffset={0.5}
                xzOffset={-1.25}
                rotationIndex={1}
            />
            <ground
                name={`${props.name}-electric-company-image`}
                position={props.position.add(new Vector3(0, 0.5 + DefaultMeshOffset, 0)).add(getSpecialPropertyOffset(1))}
                width={RectangleDimensions[2].width}
                height={RectangleDimensions[2].height}
                rotation={getRotation(3)}
            >
                <ElectricCompanyMaterial />
            </ground> 
            <JsText
                name={`${props.name}-value`}
                text={["$150"]}
                position={props.position}
                yOffset={0.5}
                xzOffset={1.825}
                rotationIndex={1}
            />
        </EdgeNode>
    );
}