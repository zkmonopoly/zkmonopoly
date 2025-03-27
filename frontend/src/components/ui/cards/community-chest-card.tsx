import { EventCard, EventCardWithoutNameProps } from "./shared/event-card";

export function CommunityChestCard(props: EventCardWithoutNameProps) {
    return (
        <EventCard name="COMMUNITY CHEST" {...props}/>
    )
}