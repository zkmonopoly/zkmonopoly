import Inviter from "@/components/ui/inviter";
import { Button } from "react-aria-components";
import { twMerge } from "tailwind-merge";
import { buttonStyles } from "./core/styles/button";
import { LuDices } from "react-icons/lu";
import { GameController } from "@/controllers/game-controller";

import Auction from "./auction";
import Ready from "./ready";

export default function Control() {
  const context = GameController.getInstance();
  
  return (
    <div className="grid grid-cols-2 border-t px-2 gap-2 text-xs">
      <div className="mt-2 place-self-center text-lg col-span-2">CONTROL</div>
      <Button 
        onPress={() => context.onRollDice()}
        className={twMerge(buttonStyles, "bg-red-500 pressed:bg-red-400")}>
        <LuDices className="inline-block mb-1"/>  Roll dice
      </Button>
      <Ready />
      <Inviter/>
      <div>
        {/* dummy */}
      </div>
      <Auction />
      <div>
        {/* dummy */}
      </div>
    </div>
  )
}