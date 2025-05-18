import { useState } from "react";
import { twJoin, twMerge } from "tailwind-merge";
import { LuChevronRight } from "react-icons/lu";
import { Button } from "react-aria-components";
import { SelectItem, SelectWrapper } from "./core/wrappers/select-wrapper";
import { buttonStyles } from "./core/styles/button";
import { GameController } from "@/controllers/game-controller";

interface InteractiveConsoleProps {
    className?: string;
}

// animation styling
const consoleButtonHeight: number = 24;

export function InteractiveConsole(props: InteractiveConsoleProps) {
  const [consoleOpen, setConsoleOpen] = useState(false);

  const [selectedCommand, setSelectedCommand] = useState<string>("Item 1");

  const [logs, setLogs] = useState<{ command: string }[]>([]);

  // TODO: add shared state/service to manage console state (add new lines, clear, etc)

  const context = GameController.getInstance();

  function runCommand(command: string) {
    switch (command) {
    case "roll-dice":
      context.onRollDice();
      break;
    case "item-2":
      console.log("Item 2 executed!");
      break;
    default:
      console.warn("Unknown command:", command);
    }

    setLogs((prevLogs) => [...prevLogs, { command }]);
  }

  return (
    <div
      className={twMerge(
        props.className,
        "flex flex-col border-gray-200",
        "transition-[width,background-color,opacity] duration-300",
        "scrollbar-none",
        consoleOpen ? "w-72" : "w-8",
        consoleOpen ? "overflow-y-auto" : "overflow-y-hidden",
        consoleOpen ? "bg-black/20" : "bg-transparent"
      )}
    >
      <div className="relative">
        <span
          className={twJoin(
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
            consoleOpen ? "" : "hidden"
          )}
        >
                    CONSOLE
        </span>
        <Button
          className="float-end w-8 inline-flex justify-center self-end hover:bg-black/10 py-1"
          onPress={() => setConsoleOpen(!consoleOpen)}
        >
          <LuChevronRight
            size={consoleButtonHeight}
            className={twJoin(
              "transition-[rotate] duration-300",
              consoleOpen ? "rotate-0" : "-rotate-180"
            )}
          />
        </Button>
      </div>
      <pre
        className={twJoin(
          "scrollbar-thin scrollbar-black text-xs w-full h-full px-2 overflow-y-scroll [&_p]:my-1 [&_p]:text-wrap [&_p]:break-all",
          consoleOpen ? "" : "hidden"
        )}
      >
        {logs.map((log, i) => (
          <p key={i}>
            <span className="text-rose-400">$ {log.command}</span>
            <br />
          </p>
        ))}
      </pre>
      <div
        className={twJoin(
          "m-2 flex justify-between",
          consoleOpen ? "" : "hidden"
        )}
      >
        <SelectWrapper
          className="min-w-32"
          label="Command"
          onSelectionChange={(key) =>
            setSelectedCommand(key as string)
          }
        >
          <SelectItem id="roll-dice">Roll Dice</SelectItem>
        </SelectWrapper>
        <Button
          className={twMerge(
            buttonStyles,
            "text-xs h-fit place-self-end"
          )}
          onPress={() => runCommand(selectedCommand)}
        >
                    Send
        </Button>
      </div>
    </div>
  );
}
