import { Room, Client } from "@colyseus/core";
import { RoomState } from "./schema/RoomState";

// Reference from: https://github.com/itaylayzer/Monopoly/blob/main/src/assets/server.ts
// https://github.com/itaylayzer/Monopoly/blob/main/src/assets/monopoly.json
export class MonopolyRoom extends Room<RoomState> {
  maxClients = 4;
  state = new RoomState();
  onCreate (options: any) {
    this.state = new RoomState();

    // this.onMessage("type", (client, message) => {
    //   //
    //   // handle "type" message
    //   //

    // });
  }

  onJoin (client: Client, options: any) {
    console.log(client.sessionId, "joined!");
  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
