import { type Auction } from "@/models/auction";
import { LuCheck, LuX } from "react-icons/lu";

interface AuctionProps {
  auction?: Auction;
}

export default function Auction(props: AuctionProps) {
  if (!props.auction) {
    return null;
  }

  return (
    props.auction && <div className="flex flex-col border-t px-2 gap-1 text-xs">
      <div className="mt-2 place-self-center text-sm">AUCTION</div>
      <div>Property: {props.auction.propertyName || "N/A"}</div>
      <div>Number of participants: {props.auction.bets.filter((bet) => bet.status === true).length}</div>
      <div className="flex ">
        {props.auction.bets.map((bet, index) => 
          <div key={index}>
            <div className="border p-1">{bet.name}</div>
            <div className="border [&>svg]:mx-auto p-1">
              {bet.status === true ? 
              <LuCheck size={16} /> :
              <LuX size={16} />}
            </div>
          </div>
        )}
      </div>
      {props.auction.result && 
      <div>
        Winner: {props.auction.result.name}  
      </div>}
    </div>
  )
}