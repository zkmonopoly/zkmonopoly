import { Command } from "@colyseus/command";
import { MonopolyRoom } from "../MonopolyRoom";
import { ArraySchema } from "@colyseus/schema";
import { RoomState } from "@rooms/schema/RoomState";
import { Auction } from "@rooms/schema/AuctionState";

interface AuctionPayload {
    action: "start" | "bid" | "end";
    propertyId: string;
    bidders?: string[];
    duration?: number;
    bidderId?: string;
    amount?: number;
}

export class AuctionCommand extends Command<MonopolyRoom, AuctionPayload> {
    execute(payload: AuctionPayload) {
        // Initialize auction state if not present
        if (!this.room.state.auction) {
            const auctionInstance = new Auction();
            this.room.state.auction = auctionInstance;
        }

        const auction = this.room.state.auction;

        switch (payload.action) {
            case "start":
                auction.propertyId = payload.propertyId;
                auction.currentBid = 0;
                auction.highestBidder = "";
                auction.bidders = new ArraySchema<string>(...(payload.bidders || []));
                auction.isActive = true;
                auction.endTime = Date.now() + (payload.duration || 30000);
                this.room.broadcast("auctionStarted", auction);
                // Optionally, set a timeout to end the auction automatically
                setTimeout(() => {
                    if (auction.isActive) {
                        this.room.dispatcher.dispatch(new AuctionCommand(), {
                            action: "end",
                            propertyId: auction.propertyId,
                        });
                    }
                }, payload.duration || 30000);
                break;

            case "bid":
                if (!auction.isActive) return;
                if (!payload.bidderId || typeof payload.amount !== "number") return;
                if (!auction.bidders.includes(payload.bidderId)) return;
                if (payload.amount <= auction.currentBid) return;
                auction.currentBid = payload.amount;
                auction.highestBidder = payload.bidderId;
                this.room.broadcast("auctionBid", { ...auction });
                break;

            case "end":
                if (!auction.isActive) return;
                auction.isActive = false;
                this.room.broadcast("auctionEnded", {
                    winner: auction.highestBidder,
                    amount: auction.currentBid,
                    propertyId: auction.propertyId,
                });
                // Optionally, handle property assignment here
                break;
        }
    }
}