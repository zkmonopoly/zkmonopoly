import { GameController } from "@/controllers/game-controller";
import { $playerStates } from "@/models/player";
import { useStore } from "@nanostores/react";
import { useMemo } from "react";
import { LuCircle, LuHouse } from "react-icons/lu";

export default function PlayerInfo() {
  const sessionId = GameController.getInstance().getNetwork().getRoom()?.sessionId;
  const playerStates = useStore($playerStates);
  const player = useMemo(() => playerStates.find(player => player.id === sessionId), [playerStates]);

  return (
    <div className="absolute bg-black/40 flex gap-x-2 p-2 min-w-[256px]">
      <LuCircle className="mt-1" color="#f6339a" fill="#f6339a"/>
      <div>{player?.username}</div>
      <LuHouse className="mt-1" color="#00c951" fill="#00c951"/>
      <div>need a house count here</div>
      <div>${player?.balance}</div>
    </div>
  );
}