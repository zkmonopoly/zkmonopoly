import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";
import { Player } from "../../state/PlayerState";

export class RoomState extends Schema {
  @type({ map: Player })
  players = new MapSchema<Player>();

  @type(["string"])
  logs = new ArraySchema<string>();

  @type("string")
  currentTurn: string = "";

}
