import { OverlayArrow, Tooltip, TooltipProps } from "react-aria-components";
import { tooltipStyles } from "@/components/ui/core/styles/tooltip";
import { twMerge } from "tailwind-merge";

interface TooltipWrapperProps extends Omit<TooltipProps, "children" | "className"> {
    children: React.ReactNode;
    className?: string;
}

export function TooltipWrapper({ className, ...props }: TooltipWrapperProps) {
    return (
        <Tooltip className={twMerge(tooltipStyles, className)} {...props}>
            <OverlayArrow>
                <svg width={8} height={8} viewBox="0 0 8 8">
                    <path d="M0 0 L4 4 L8 0" />
                </svg>
            </OverlayArrow>
            {props.children}
        </Tooltip>
    );
}