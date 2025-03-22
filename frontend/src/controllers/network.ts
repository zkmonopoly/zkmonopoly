import { Client, Room } from "colyseus.js";
import { GameController } from "./game-controller";
import dotenv from "dotenv";
dotenv.config();

export class Network {
    private client: Client;
    private room: Room<any> | undefined;
    private gameController: GameController;

    constructor(gameController: GameController) {
        this.client = new Client(
            process.env.REACT_APP_COLYSEUS_ENDPOINT || "ws://localhost:2567"
        );
        this.gameController = gameController;
    }

    async joinRoom(roomName: string, options?: any): Promise<Room<any>> {
        this.room = await this.client.joinOrCreate(roomName, options);
        return this.room;
    }

    send(type: string, payload?: any) {
        if (this.room) {
            this.room.send(type, payload);
        }
    }

    onMessage(type: string, callback: (message: any) => void) {
        this.room?.onMessage(type, (message) => {
            callback(message);
            this.gameController.notifyListeners();
        });
    }

    getRoom(): Room<any> | null {
        return this.room ?? null;
    }
}
