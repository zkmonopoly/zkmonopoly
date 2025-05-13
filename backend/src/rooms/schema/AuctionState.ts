import { Schema, type, ArraySchema } from "@colyseus/schema";

export class Auction extends Schema {
    @type("string") propertyId = "";
    @type("number") currentBid = 0;
    @type("string") highestBidder = "";
    @type([ "string" ]) bidders = new ArraySchema<string>();
    @type("boolean") isActive = false;
    @type("number") endTime = 0;
}