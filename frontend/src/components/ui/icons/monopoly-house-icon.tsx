import { LuHouse } from "react-icons/lu";
import { twJoin } from "tailwind-merge";

interface MonopolyHouseIconProps {
    text?: string;
    hexColor: string;
}

export default function MonopolyHouseIcon(props: MonopolyHouseIconProps) {
  return (
    <div className="inline-block relative size-[18px] align-top">
      <LuHouse size={18} className="z-0 absolute inline" color={props.hexColor} fill={props.hexColor}/>
      <span className={
        twJoin(
          "text-white z-10 absolute left-1/2 text-xs",
          // special cases
          props.text === "1" ? "-translate-x-0.5 translate-y-0.5" : "-translate-x-[0.2rem] translate-y-[0.1875rem]"
        )
      }>{props.text}</span>
    </div>
  );
}