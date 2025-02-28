import { Button, Tab, Key, TabProps, TabsContext, TooltipTrigger, useSlottedContext } from "react-aria-components";
import { TooltipWrapper } from "./ui/wrappers/tooltip-wrapper";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { tabStyles } from "./ui/styles/tabs";

interface TooltipTriggerTabProps extends Omit<TabProps, "className"> {
    id: Key;
    className?: string;
    text: string;
    children: ReactNode;
}

export function TooltipTriggerTab({ className, children,  text, ...props}: TooltipTriggerTabProps) {
    const state = useSlottedContext(TabsContext)!;

    function onTooltipTriggerTabPress() {
        state.onSelectionChange!(props.id);
    }

    return (
        <Tab className={twMerge(tabStyles, className)} {...props}>
            <TooltipTrigger>
                <Button onPress={onTooltipTriggerTabPress}>{children}</Button>
                <TooltipWrapper placement="left">{text}</TooltipWrapper>
            </TooltipTrigger>
        </Tab>
    );
}