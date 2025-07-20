import { Client, Room } from "colyseus.js";
import { GameController } from "./game-controller";
import { PlayerState } from "@/components/state/player-state";
import { $playerStates } from "@/models/player";
import { RoomState } from "@/components/state/room-state";

// import dotenv from "dotenv";
// dotenv.config();

export class Network {
  private client: Client;
  private room: Room<RoomState> | undefined;
  private gameController: GameController;
  private roomName: string = "my_room";

  constructor(gameController: GameController) {
    this.client = new Client(
      import.meta.env.VITE_COLYSEUS_ENDPOINT || "ws://localhost:2567"
    );
    console.log("Create connection: ", this.client);
        
    this.gameController = gameController;
        
  }

  async createRoom(roomName: string): Promise<Room<any>> {
    this.roomName = roomName;
    console.log("Creating room: ", this.roomName);
    this.room = await this.client.create(this.roomName);
    return this.room;
  }

  async joinOrCreateRoom(roomName: string): Promise<Room<any>> {
    this.roomName = roomName;
    console.log("Joining room: ", this.roomName);
    this.room = await this.client.joinOrCreate(this.roomName);
    return this.room;
  }

  async joinRoomById(roomId: string): Promise<Room<any>> {
    console.log("Joining room by ID: ", roomId);
    this.room = await this.client.joinById(roomId);
    return this.room;
  }

  send(type: string, payload?: any) {
    if (this.room) {
      this.room.send(type, payload);
    }
  }

  onMessage(type: string, callback: (message: any) => void) {
    this.room?.onMessage(type, (message: any) => {
      callback(message);
      this.gameController.notifyListeners();
      // console.log("Message received: ", message);
    });
  }

  

  onStateChange(callback: (state: any) => void) {
    // console.log( "onStateChange", this.updatePlayerState(this.room?.state));
    this.room?.onStateChange((state: any) => {
      callback(state);
      // console.log("State changed: ", state);
    });
  }


  getRoomState(){
    return this.room?.state;
  }

  convertToPlayerData(p: any): PlayerState {
      return {
        id: p.id,
        username: p.username,
        icon: p.icon,
        position: p.position,
        balance: p.balance,
        properties: Array.from(p.properties ?? []),
        isInJail: p.isInJail,
        jailTurnsRemaining: p.jailTurnsRemaining,
        getoutCards: p.getoutCards,
        ready: p.ready,
        isBankrupt: p.isBankrupt,
        aliasName: p.aliasName || ""
      };
    }
  
    updatePlayerState (state: any): PlayerState[] {
      const playerArray: PlayerState[] = [];
      state.players.forEach((playerSchema: any) => {
        playerArray.push(this.convertToPlayerData(playerSchema));
      });
      console.log("Player states playerArray: ", playerArray);
      $playerStates.set(playerArray);
      return playerArray;
    };
  


  getRoom(): Room<any> | null {
    return this.room ?? null;
  }
}
