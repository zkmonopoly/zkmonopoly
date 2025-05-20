import EventCard, { EventCardWithoutNameProps } from "./shared/event-card";

export default function CommunityChestCard(props: EventCardWithoutNameProps) {
  return (
    <EventCard name="COMMUNITY CHEST" {...props}/>
  );
}