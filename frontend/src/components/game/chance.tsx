import { Color3 } from "@babylonjs/core";
import { EdgeNodeProps, EdgeNode } from "./edge-node";
import { JsText } from "./texts/js-text";

interface ChanceNodeProps extends Omit<EdgeNodeProps, "children" | "rotation"> {
    rotationIndex?: number
    color?: Color3;
}

export function ChanceNode({ rotationIndex = 0,  ...props}: ChanceNodeProps) {
    return (
        <EdgeNode {...props}>
            <JsText
                name={`${props.name}-chance-text`}
                text={["CHANCE"]}
                position={props.position}
                yOffset={0.5}
                xzOffset={-1.25}
                rotationIndex={rotationIndex}
            />
            <JsText
                name={`${props.name}-question-mark`}
                text={["?"]}
                position={props.position}
                yOffset={0.5}
                xzOffset={1.825}
                fontScale={10}
                color={props.color}
                rotationIndex={rotationIndex}
            />
        </EdgeNode>
    );
}