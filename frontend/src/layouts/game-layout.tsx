import InteractiveConsole from "@/components/ui/interactive-console";
import GameMenu from "@/components/ui/game-menu";
import Auction from "@/components/ui/auction";
import { Outlet, useLocation } from "react-router";
import { useEffect, useMemo, useState } from "react";
import AuctionController, { AuctionCallname, AuctionCallnameList } from "@/controllers/auction-controller";
import SelectWrapper, { SelectItem } from "@/components/ui/core/wrappers/select-wrapper";

export default function GameLayout() {
  const location = useLocation();
  const pathname = useMemo(() => {
    return location.pathname.split("/").at(2);
  }, [location]);
  const [selectedCommand, setSelectedCommand] = useState<any>();
  const [dataCount, setDataCount] = useState<number>(0);
  const [winner, setWinner] = useState<string>();

  useEffect(() => {
    if (pathname && selectedCommand) {
      const auctionController = new AuctionController(
        { 
          name: pathname,
          size: 2
        },
        selectedCommand as AuctionCallname,
        setDataCount
      );
      auctionController.connect().then(() => {
        console.log("auction: connected")
        let x;
        if (selectedCommand === "alice") {
          x = auctionController.mpcLargest(10);
        } else if (selectedCommand === "bob") {
          x = auctionController.mpcLargest(15);
        } else {
          x = auctionController.mpcLargest(24);
        }
        console.log("auction: wait");
        x.then((res) => console.log(setWinner(AuctionCallnameList[res.winner as number])));
      });
    }
  }, [pathname, selectedCommand]);

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
                onSelectionChange={(key) =>
                  setSelectedCommand(key)
                }
              >
                <SelectItem id="alice">Alice</SelectItem>
                <SelectItem id="bob">Bob</SelectItem>
                <SelectItem id="charlie">Charlie</SelectItem>
              </SelectWrapper>
              <div className="text-xs ml-2 mt-2">data transferred: {dataCount} KB</div>
              <div className="text-xs ml-2 mt-2">winner: {winner || "N/A"}</div>
            </div>
          </div>
          <div>
            {/* <Outlet /> */}
          </div>
          <InteractiveConsole className="h-full z-10 absolute right-0 top-0 bottom-0" />
        </div>
      </div>
    </div>
  );
}