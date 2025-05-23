import InteractiveConsole from "@/components/ui/interactive-console";
import GameMenu from "@/components/ui/game-menu";
import Auction from "@/components/ui/auction";
import { Outlet, useLocation } from "react-router";
import { useEffect, useMemo } from "react";
import AuctionController from "@/controllers/auction-controller";

export default function GameLayout() {
  const location = useLocation();
  const pathname = useMemo(() => {
    return location.pathname.split("/").at(2);
  }, [location]);
  const auctionController = new AuctionController();

  useEffect(() => {
    if (pathname) {
      const party = prompt("party:") || "alice";
      auctionController.connect(pathname, party as "alice" | "bob").then(() => {
        let x;
        if (party === "alice") {
          x = auctionController.mpcLargest(99);
        } else {
          x = auctionController.mpcLargest(10);
        }
        x.then((res) => alert(res === 1 ? "alice" : (res === 2 ? "bob" : "equal")));
      });
    }
  }, [pathname]);

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
              <div className="text-xs ml-2 mt-2">debug: {pathname}</div>
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