import EventCard, EventCardWithoutNameProps } from "./shared/event-card";

export default function ChanceCard(props: EventCardWithoutNameProps) {
  return (
    <EventCard name="CHANCE" {...props}/>
  );
}