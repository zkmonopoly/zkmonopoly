import { EdgeNode, EdgeNodeProps } from "./edge-node";
import { JsText } from "./texts/js-text";

interface IncomeTaxNodeProps extends Omit<EdgeNodeProps, "children" | "rotation"> {}

export function IncomeTaxNode(props: IncomeTaxNodeProps) {
    return (
        <EdgeNode {...props}>
            <JsText
                name={`${props.name}-income-tax-text`}
                text={["INCOME", "TAX"]}
                position={props.position}
                yOffset={0.5}
                xzOffset={-1.25}
                rotationIndex={0}
            />
            { /* TODO: Add money bag texture */ }
            <JsText
                name={`${props.name}-payment`}
                text={["PAY $200"]}
                position={props.position}
                yOffset={0.5}
                xzOffset={1.825}
                rotationIndex={0}
            />
        </EdgeNode>
    );
}