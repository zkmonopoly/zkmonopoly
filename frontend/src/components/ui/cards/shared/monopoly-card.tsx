import { PropsWithChildren } from "react";

export default function MonopolyCard(props: PropsWithChildren){
  return (
    <div className="bg-white p-[12px] h-[345px] min-w-[200px]">
      <div className="border h-full w-full border-black">
        {props.children}
      </div>
    </div>
  );
}