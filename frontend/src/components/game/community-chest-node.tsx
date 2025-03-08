import { Vector3 } from "@babylonjs/core";
import { EdgeNode, EdgeNodeProps } from "./edge-node";
import { JsText } from "./texts/js-text";
import { CommunityChestMaterial } from "./materials/community-chest-material";
import { DefaultMeshOffset } from "./constants/offsets";
import { RectangleDimensions } from "./constants/dimensions";
import { getRotation, getSpecialPropertyOffset } from "./constants/rotations";

interface CommunityChestNodeProps extends Omit<EdgeNodeProps, "children" | "rotation"> {
    rotationIndex?: number
}

export function CommunityChestNode({ rotationIndex = 0,  ...props}: CommunityChestNodeProps) {
    return (
        <EdgeNode
            name={props.name}
            position={props.position}
            rotation={getRotation(rotationIndex)}
        >
            <JsText
                name={`${props.name}-community-chest-text`}
                text={["COMMUNITY", "CHEST"]}
                position={props.position}
                yOffset={0.5}
                xzOffset={-1.25}
                rotationIndex={rotationIndex}
            />
            <ground
                name={`${props.name}-community-chest-image`}
                position={props.position.add(new Vector3(0, 0.5 + DefaultMeshOffset, 0)).add(getSpecialPropertyOffset(rotationIndex))}
                width={RectangleDimensions[1].width}
                height={RectangleDimensions[1].height}
                rotation={getRotation((rotationIndex + 2) % 4)}
            >
                <CommunityChestMaterial />
            </ground> 
        </EdgeNode>
    );
}