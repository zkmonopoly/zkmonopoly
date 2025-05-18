type EventCardProps = {
    name: string;
    body: string[];
}

export type EventCardWithoutNameProps = Omit<EventCardProps, "name">

export function EventCard(props: EventCardProps) {
  return (
    <div className="bg-white p-[12px] w-full h-[240px]">
      <div className="border h-full w-full border-black text-black grid">
        <div className="text-center text-monopoly-m font-bold mt-[16px] row-span-2 align-middle">{props.name}</div>
        <div className="flex flex-col text-monopoly-m items-center justify-center row-span-10">
          {props.body.map((text) => <div>{text}</div>)}
        </div>
      </div>
    </div>
  );
}