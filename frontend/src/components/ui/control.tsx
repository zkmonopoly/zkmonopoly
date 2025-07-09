import Inviter from "@/components/ui/inviter";
import { Button } from "react-aria-components";
import { twMerge } from "tailwind-merge";
import { buttonStyles } from "./core/styles/button";
import { LuDices } from "react-icons/lu";
import { GameController } from "@/controllers/game-controller";
import Auction from "./auction";
import { useState } from "react";

export default function Control() {
  const [open, setOpen] = useState(false);
  const context = GameController.getInstance();
  
  return (
    <div className="grid grid-cols-2 border-t px-2 gap-2 text-xs">
      <div className="mt-2 place-self-center text-lg col-span-2">CONTROL</div>
      <Button 
        onPress={() => context.onRollDice()}
        className={twMerge(buttonStyles, "bg-red-500 pressed:bg-red-400")}>
        <LuDices className="inline-block mb-1"/>  Roll dice
      </Button>
      <div>
        {/* dummy */}
      </div>
      <Inviter/>
      <div>
        {/* dummy */}
      </div>
      <Button 
        onPress={() => setOpen(true)}
        className={twMerge(buttonStyles, "bg-pink-500 pressed:bg-pink-400")}>
        [DEBUG] Auction
      </Button>
      <Auction open={open}/>
    </div>
  )
}