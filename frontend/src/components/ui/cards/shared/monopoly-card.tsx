import { PropsWithChildren } from "react";

export default function MonopolyCard(props: PropsWithChildren){
  return (
    <div className="bg-white p-[12px] max-w-[240px] h-[373px]">
      <div className="border h-full w-full border-black">
        {props.children}
      </div>
    </div>
  );
}