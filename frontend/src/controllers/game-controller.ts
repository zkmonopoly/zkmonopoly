// src/game-controller/GameController.ts
import { Network } from "./network";

type StateListener = (state: any) => void;

export class GameController {
    private network: Network;
    private listeners: StateListener[] = [];
    private gameState: any = {};

    constructor() {
        this.network = new Network(this);
    }

    async joinGame(name: string) {
        const room = await this.network.joinRoom("monopoly");
        console.log("Joined room with sessionId:", room.sessionId);

        this.network.send("register", { name });
      
        this.network.onMessage("startGame", () => {
            console.log("Game started!");
        });


    }

    readyUp() {
        this.network.send("ready");
    }

    onStateUpdate(callback: StateListener) {
        this.listeners.push(callback);
    }

    notifyListeners() {
        this.listeners.forEach((listener) => listener(this.gameState));
    }
}
