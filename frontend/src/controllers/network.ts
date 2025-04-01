import { Client, Room } from "colyseus.js";
import { GameController } from "./game-controller";
// import dotenv from "dotenv";
// dotenv.config();

export class Network {
    private client: Client;
    private room: Room<any> | undefined;
    private gameController: GameController;
    private roomName: string = "my_room";

    constructor(gameController: GameController) {
        this.client = new Client(
            import.meta.env.VITE_COLYSEUS_ENDPOINT || "ws://localhost:2567"
        );
        console.log("Create connection: ", this.client);
        this.gameController = gameController;
        
    }

    async joinRoom(roomName: string, options?: any): Promise<Room<any>> {
        this.room = await this.client.joinOrCreate(this.roomName);
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
            console.log("Message received: ", message);
        });
    }

    getRoom(): Room<any> | null {
        return this.room ?? null;
    }
}
