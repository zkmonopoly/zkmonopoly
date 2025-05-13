import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";
import { Player } from "@rooms/state/PlayerState";
import { Property } from "@rooms/state/PropertyState";
import { Auction } from "@rooms/schema/AuctionState";

export class RoomState extends Schema {
  @type({ map: Player })
  players = new MapSchema<Player>();

  @type({ map: Property })
  properties = new MapSchema<Property>();

  // @type(["string"])
  // logs = new ArraySchema<string>();

  @type("string")
  currentTurn: string = "";

  @type("boolean")
  rolledDice: boolean = false;

  @type(Auction) auction: Auction | null = null;


}
