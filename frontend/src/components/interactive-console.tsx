import { useState } from "react";
import { twJoin, twMerge } from "tailwind-merge";
import { LuChevronDown } from "react-icons/lu";
import { Button } from "react-aria-components";

interface InteractiveConsoleProps {
    className?: string;
}

// animation styling
const consoleButtonHeight: number = 24;

export function InteractiveConsole(props: InteractiveConsoleProps) {
    const [consoleOpen, setConsoleOpen] = useState(false);

    // TODO: add shared state/service to manage console state (add new lines, clear, etc)

    return(
        <div
            className={twMerge(
                props.className,
                "flex flex-col border-gray-200",
                "transition-[height,background-color] duration-300",
                "scrollbar-none",
                consoleOpen ? "h-72" : "h-8",
                consoleOpen ? "overflow-y-auto" : "overflow-y-hidden",
                consoleOpen ? "bg-ubuntu" : "bg-transparent"
            )}
        >
            <Button 
                className="w-full flex justify-center hover:bg-black/10 py-1"
                onPress={() => setConsoleOpen(!consoleOpen)}
            >
                <LuChevronDown
                    size={consoleButtonHeight}
                    className={twJoin(
                        "transition-[rotate] duration-300",
                        consoleOpen ? "rotate-0" : "-rotate-180"
                    )}
                />    
            </Button>
                
            <pre className="scrollbar-thin scrollbar-neutral-800 text-xs w-full h-full px-2 overflow-y-scroll [&_p]:my-1 [&_p]:text-wrap [&_p]:break-all">
                <p>console.log()</p>
            </pre>
        </div>
    )
}