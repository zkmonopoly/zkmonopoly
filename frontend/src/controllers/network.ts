import { Client, Room } from "colyseus.js";
import dotenv from "dotenv";
dotenv.config();

export class Network {
    private client: Client;
    private room: Room<any> | undefined;
    private gameController: any;

    constructor(gameController: any) {
        this.client = new Client(process.env.REACT_APP_COLYSEUS_ENDPOINT || "ws://localhost:2567");
        this.gameController = gameController;
    }

    async connect() {
        try {
            this.room = await this.client.joinOrCreate("monopoly");
            console.log("Successful connection, ID:", this.room.sessionId);

            this.room.onMessage("updateState", (state) => {
                this.gameController.updateState(state);
            });

        } catch (error) {
            console.error("Error connection, ", error);
        }
    }



    sendRollDice() {
        if (this.room) {
            this.room.send("rollDice");
        }
    }
}
