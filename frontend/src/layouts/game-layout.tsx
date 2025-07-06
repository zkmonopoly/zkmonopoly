import InteractiveConsole from "@/components/ui/interactive-console";
import GameMenu from "@/components/ui/game-menu";
import Auction from "@/components/ui/auction";
import { Outlet, useLocation } from "react-router";
import { useEffect, useMemo, useState, useCallback } from "react";
import AuctionController, { AuctionCallname, AuctionCallnameList } from "@/controllers/auction-controller";
import SelectWrapper, { SelectItem } from "@/components/ui/core/wrappers/select-wrapper";

type ConnectionStatus = "idle" | "connecting" | "in-progress" | "error"; 

export default function GameLayout() {
  const location = useLocation();
  const pathname = useMemo(() => {
    return location.pathname.split("/").at(2);
  }, [location]);
  
  const [selectedCommand, setSelectedCommand] = useState<AuctionCallname>();
  const [auctionIndex, setAuctionIndex] = useState<number>(0);
  const [dataCount, setDataCount] = useState<number>(0);
  const [winner, setWinner] = useState<string>();
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("idle");
  const [error, setError] = useState<string>();

  // Initialize auction
  const initializeAuction = useCallback(async () => {
    if (!pathname || !selectedCommand) return;

    try {
      setConnectionStatus("connecting");
      setError(undefined);

      const auctionController = new AuctionController(
        { 
          name: pathname + "_" + auctionIndex, 
          size: 3
        },
        selectedCommand,
        setDataCount
      );

      let bidValue: number;
      if (selectedCommand === "alice") {
        bidValue = 10;
      } else if (selectedCommand === "bob") {
        bidValue = 15;
      } else {
        bidValue = 24;
      }

      setConnectionStatus("in-progress");
      const result = await auctionController.mpcLargest(bidValue);
      
      if (result.winner !== undefined) {
        const winnerName = AuctionCallnameList[result.winner as number];
        setWinner(winnerName);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setConnectionStatus("idle");
      setAuctionIndex(prev => prev + 1);
    }
  }, [pathname, selectedCommand]);

  // Effect to initialize auction when dependencies change
  useEffect(() => {
    if (pathname && selectedCommand) {
      initializeAuction();
    }
  }, [pathname, selectedCommand, initializeAuction]);

  // Status indicator component
  function StatusIndicator() {
    switch (connectionStatus) {
      case "idle":
        return <div className="text-xs ml-2 mt-2 text-gray-600">Status: Not connected</div>;
      case "connecting":
        return <div className="text-xs ml-2 mt-2 text-yellow-600">Status: Connecting</div>;
      case "in-progress":
        return <div className="text-xs ml-2 mt-2 text-green-600">Status: In progress</div>;
      case "error":
        return <div className="text-xs ml-2 mt-2 text-red-600">Status: Error - {error}</div>;
    }
  }

  return (
    <div className='flex flex-col min-h-screen antialiased'>
      <div className='flex flex-grow'>
        <div className="w-full flex relative">
          <div className="hidden md:block">
            <div className="min-w-[256px] h-full flex flex-col justify-start">
              <GameMenu />
              <Auction 
                auction={{
                  bets: [{name: "Alice", status: true}]
                }}
              />
              <SelectWrapper
                className="min-w-32 ml-2 mt-2"
                label="Callname"
                onSelectionChange={(key) => {
                  setSelectedCommand(key as AuctionCallname);
                }}
              >
                <SelectItem id="alice">Alice</SelectItem>
                <SelectItem id="bob">Bob</SelectItem>
                <SelectItem id="charlie">Charlie</SelectItem>
              </SelectWrapper>
              <StatusIndicator />
              <div className="text-xs ml-2 mt-2">Data transferred: {dataCount} KB</div>
              <div className="text-xs ml-2 mt-2">Winner: {winner || "N/A"}</div>
            </div>
          </div>
          <div>
            <Outlet />
          </div>
          <InteractiveConsole className="h-full z-10 absolute right-0 top-0 bottom-0" />
        </div>
      </div>
    </div>
  );
}