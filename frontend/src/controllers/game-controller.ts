// src/game-controller/GameController.ts
import { Network } from "./network";

type StateListener = (state: any) => void;

export class GameController {
    private network: Network;
    private listeners: StateListener[] = [];
    private gameState: any = {};

    constructor() {
        this.network = new Network(this);
        // WAIT FOR 1 SECOND BEFORE JOINING THE GAME
        setTimeout(() => {
            this.joinGame("Simi");
        }, 1000);

        // this.joinGame("Simi");
    }

    async joinGame(name: string) {
        const room = await this.network.joinRoom("monopoly");
        console.log("Joined room with sessionId:", room);

        this.network.send("register", name);

        this.onReady();
    }

    onReady() {
        this.network.send("ready");
        this.network.onMessage("ready", (state) => {
            this.gameState = state;
            console.log("Game state ready: ", this.gameState);
        });
        this.network.onMessage("start-game", (state) => {
            this.gameState = state;
            console.log("Game state start-game: ", this.gameState);
        });

        this.network.onMessage("new-player", (state) => {
            this.gameState = state;
            console.log("Game state new-player: ", this.gameState);
        });
    }

    

    onStateUpdate(callback: StateListener) {
        this.listeners.push(callback);
    }

    notifyListeners() {
        console.log("Notifying listeners with game state:", this.gameState);
        this.listeners.forEach((listener) => listener(this.gameState));
    }
}
