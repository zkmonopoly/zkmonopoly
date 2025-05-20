import MonopolyCard from "./monopoly-card";

interface UtilityPropertyCardProps {
    name: string;
    iconUrl: string;
}

export default function UtilityPropertyCard(props: UtilityPropertyCardProps) {
  return (
    <MonopolyCard>
      <div className="p-[7.5px] h-full">
        <div className="flex flex-col items-center h-4/7 justify-around">
          <img src={props.iconUrl} alt="railroad" className="h-[108px]"/>
          <div className="text-black text-monopoly-m font-bold">{props.name}</div>
        </div>
        <div className="text-black space-y-[8px] text-center text-monopoly-m">
          <div>
            <div>If one Utility is owned,</div>
            <div>rent is 4 times amount</div>
            <div>shown on dice.</div>
          </div>
          <div>
            <div>If both Utilities are owned,</div>
            <div>rent is 10 times amount</div>
            <div>shown on dice.</div>
          </div>
        </div>
      </div>
    </MonopolyCard>
  );
}