import { LuCircle, LuHouse } from "react-icons/lu";

export default function PlayerInfo() {
  return (
    <div className="absolute bg-black/40 flex gap-x-2 p-2 min-w-[256px]">
      <LuCircle className="mt-1" color="#f6339a" fill="#f6339a"/>
      <div>player_name</div>
      <LuHouse className="mt-1" color="#00c951" fill="#00c951"/>
      <div>0</div>
      <div>$1000</div>
    </div>
  );
}