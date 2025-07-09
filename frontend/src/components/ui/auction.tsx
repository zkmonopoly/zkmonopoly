import { type Auction } from "@/models/auction";
import { ModalWrapper } from "./core/wrappers/modal-wrapper";
import { modalStyles } from "./core/styles/modal";
import { useState } from "react";
import { DebugModel } from "./core/debug/model";
import { url } from "inspector";
import { Input, Button } from "react-aria-components";
import { LuCheck, LuCopy, LuSkipForward } from "react-icons/lu";
import { twJoin, twMerge } from "tailwind-merge";
import { buttonStyles } from "./core/styles/button";
import { textFieldsStyles } from "./core/styles/text-field";
import TooltipWrapper from "./core/wrappers/tooltip-wrapper";

type ConnectionStatus = "idle" | "connecting" | "in-progress" | "error"; 

export default function Auction(props: DebugModel) {
  const [auctionIndex, setAuctionIndex] = useState<number>(0);
  const [dataCount, setDataCount] = useState<number>(0);
  const [executionTime, setExecutionTime] = useState<number>(0);
  const [winner, setWinner] = useState<string>();
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("idle");
  const [error, setError] = useState<string>();

  function StatusIndicator() {
    switch (connectionStatus) {
      case "idle":
        return <span className="text-gray-600">Not connected</span>;
      case "connecting":
        return <span className="text-yellow-600">Connecting</span>;
      case "in-progress":
        return <span className="text-green-600">In progress</span>;
      case "error":
        return <span className="text-red-600">Error - {error}</span>;
    }
  }

  if (!props.open) {
    return null;
  }

  return (
    <ModalWrapper isOpen={props.open} className={modalStyles}>
      <div className="flex flex-col rounded-md gap-2 w-[260px]">
        <div className="mt-2 place-self-center text-sm">AUCTION #1</div>
        <div>Property: "N/A</div>
        <div>Status: <StatusIndicator/></div>  
        <div>Alias: {/* add callname here */}</div>
        <div>
          Winner: <span className="font-bold">{/* add winner here */}</span>
        </div>
        <div>
          Data transferred: {dataCount} KB
        </div>
        <div>
          Execution time: {executionTime} s
        </div>
        <div className={twMerge(textFieldsStyles, "flex-row max-w-[256px]")}>
          <Input className="!rounded-e-none min-w-0"/>
          <Button onPress={() => { /* send value */ }} className={twMerge(buttonStyles, "rounded-s-none min-w-fit" )}>
            <LuCheck className="mb-1 inline"/> Submit
          </Button>
        </div>
        <Button className={twJoin(buttonStyles, "w-[256px]")}>
          <LuSkipForward className="mb-1 inline"/> Skip
        </Button>
      </div>
    </ModalWrapper>
  )
}