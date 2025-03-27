import { EventCard, EventCardWithoutNameProps } from "./shared/event-card";

export function ChanceCard(props: EventCardWithoutNameProps) {
    return (
        <EventCard name="CHANCE" {...props}/>
    )
}