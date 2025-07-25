import InteractiveConsole from "@/components/ui/interactive-console";
import GameMenu from "@/components/ui/game-menu";
import { Outlet } from "react-router";
import Censored from "@/components/ui/core/debug/censored";
import Control from "@/components/ui/control";
import PlayerInfo from "@/components/ui/player-info";

export default function GameLayout() {
  return (
    <div className='flex flex-col min-h-screen antialiased'>
      <div className='flex flex-grow'>
        <div className="w-full flex relative">
          <div className="hidden md:block">
            <div className="w-[272px] h-full flex flex-col justify-start">
              <GameMenu />
              <Control />
            </div>
          </div>
          <div className="relative">
            <PlayerInfo/>
            <Outlet />
            {/* <Censored/> */}
          </div>
          <InteractiveConsole className="h-full z-10 absolute right-0 top-0 bottom-0" />
        </div>
      </div>
    </div>
  );
}