import { RailroadPropertyInfo } from "@/models/property";
import MonopolyCard from "./shared/monopoly-card";

interface RailroadPropertyCardProps {
  propertyInfo: RailroadPropertyInfo;
}

export default function RailroadPropertyCard(props: RailroadPropertyCardProps) {
  return (
    <MonopolyCard>
      <div className="p-[7.5px] h-full">
        <div className="flex flex-col items-center h-4/7 justify-around">
          <img src="/assets/game/2d/railroad.png" alt="railroad" width={108} height={108}/>
          <div className="text-black text-monopoly-m font-bold">{props.propertyInfo.name}</div>
        </div>
        <div className="text-black space-y-[8px] my-[7.5px]">
          <div className="flex justify-between tracking-tighter">
            <div>Rent</div>
            <div>$25</div>
          </div>
          <div className="flex justify-between tracking-tighter">
            <div>Owned 2 stations</div>
            <div>$50</div>
          </div>
          <div className="flex justify-between tracking-tighter">
            <div>Owned 3 stations</div>
            <div>$100</div>
          </div>
          <div className="flex justify-between tracking-tighter">
            <div>Owned 4 stations</div>
            <div>$200</div>
          </div>
        </div>
      </div>
    </MonopolyCard>
  );
}