import EventCard from "./shared/event-card";

interface CommunityChestCardProps {
  name: string;
  body: string[];
}

export default function CommunityChestCard({ name, body }: CommunityChestCardProps) {
  return (
    <EventCard name={name} body={body} />
  );
}