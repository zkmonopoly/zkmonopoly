import { type Auction } from "@/models/auction";
import { ModalWrapper } from "./core/wrappers/modal-wrapper";
import { modalStyles } from "./core/styles/modal";
import { useState } from "react";

type ConnectionStatus = "idle" | "connecting" | "in-progress" | "error"; 

interface AuctionProps {
  auction: Auction | null;
  onAuctionFinished: () => void;
}

export default function Auction(props: AuctionProps) {
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

  if (!props.auction) {
    return null;
  }

  return (
    <ModalWrapper isOpen={props.auction != null} className={modalStyles}>
      <div className="flex flex-col rounded-md  w-[264px]">
        <div className="mt-2 place-self-center text-sm">AUCTION #{props.auction.index}</div>
        <div>Property: {props.auction.propertyName || "N/A"}</div>
        <div>Status: <StatusIndicator/></div>  
        <div>Callname: {/* add callname here */}</div>
        <div>
          Winner: <span className="font-bold">{/* add winner here */}</span>
        </div>
        <div>
          Data transferred: {dataCount} KB
        </div>
        <div>
          Execution time: {executionTime} s
        </div>
      </div>
    </ModalWrapper>
  )
}