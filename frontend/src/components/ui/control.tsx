import Inviter from "@/components/ui/inviter";
import { Button } from "react-aria-components";
import { twMerge } from "tailwind-merge";
import { buttonStyles } from "./core/styles/button";
import { LuDices } from "react-icons/lu";
import { GameController } from "@/controllers/game-controller";
import Auction from "./auction";
import { useState } from "react";
import { Auction as AuctionModel } from "@/models/auction";

export default function Control() {
  const [auction, setAuction] = useState<AuctionModel | null>(null);
  const context = GameController.getInstance();
  
  return (
    <div className="flex flex-col border-t px-2 gap-2 text-xs">
      <div className="mt-2 place-self-center text-lg">CONTROL</div>
      <div className="flex-wrap flex gap-2">
        <Button 
          onPress={() => context.onRollDice()}
          className={twMerge(buttonStyles, "bg-red-500 pressed:bg-red-400")}>
          <LuDices className="inline-block mb-1"/>  Roll dice
        </Button>
        
      </div>
      <div className="flex-wrap flex gap-2">
        <Inviter/>
      </div>
      <div className="flex">
        <Button 
          onPress={() => setAuction({
            index: 1,
            propertyName: "whatever"
          })}
          className={twMerge(buttonStyles, "bg-pink-500 pressed:bg-pink-400")}>
          [DEBUG] Auction
        </Button>
        <Auction auction={auction} onAuctionFinished={() => setAuction(null)}/>
      </div>
    </div>
  )
}