// src/game-controller/GameController.ts
import { Network } from "./network";

type StateListener = (roomState: any, payload: any) => void;

export class GameController {
    private static instance: GameController | null = null;

    network: Network;
    private listeners: StateListener[] = [];
    // private gameState: any = {}
    private payload: any = {};

    public static getInstance(): GameController {
        if (!GameController.instance) {
          GameController.instance = new GameController();
        }
        return GameController.instance;
      }
    

    private constructor() {
        this.network = new Network(this);
        // WAIT FOR 1 SECOND BEFORE JOINING THE GAME


        this.joinGame("Simi");
    }

    async joinGame(name: string) {
        const room = await this.network.joinRoom("my_room");
        console.log("Joined room with sessionId:", room);

        // this.network.send("register", name);
        this.onRegister(name);
        this.onReady();

    }

    // This function is used to simulate the game for player 1 and 2
    registerPlayer1(){
        console.log("Registering player 1...");
        this.joinGame("Player 1");
    }

    registerPlayer2(){
        console.log("Registering player 2...");
        this.joinGame("Player 2");
    }

    readyPlay(){
        console.log("Player ready...");
        this.onReady();
    }

    onRegister(name: string) {
        this.network.send("register", name);
        console.log("Registered player with name:", name);
        this.network.onMessage("initials", (payload) => {
            console.log("Game state register: ", payload);
            this.payload = payload;
        });
    }

    onReady() {
        this.network.send("ready");
        this.network.onMessage("ready", (payload) => {
            console.log("Game state ready: ", payload);
            this.payload = payload;
        });
        this.network.onMessage("start-game", (payload) => {
            console.log("Game state start-game: ", payload);
            this.payload = payload;
        });

        this.network.onMessage("new-player", (payload) => {
            console.log("Game state new-player: ", payload);
            this.payload = payload;
        });
    }

    // Component A, B, C listen to dice_roll_result 
    // -> change state of A B C 

    onDiceRollResultMessage(callback: (message: any) => void) {
        console.log("Listening for dice_roll_result message");
        this.network.onMessage("dice_roll_result", (message) => {
            console.log("Game state dice_roll_result: ", message);
            callback(message);
        });
    }


    onRollDice() {
        console.log("Rolling dice...");
        this.network.send("roll_dice");
        // this.network.onMessage("dice_roll_result", (payload) => {
        //     console.log("Game state dice_roll_result: ", payload);
        //     this.payload = payload;
        //     // this.notifyListeners();
        // });

        // this.onDiceRollResultMessage((payload) => {
        //     console.log("Game state dice_roll_result: ", payload);
        //     this.payload = payload;
        //     this.notifyListeners();
        // }
        // );

        this.network.onMessage("offer_buy_property", (payload) => {
            console.log("Game state offer_buy_property: ", payload);
            this.payload = payload;
        });
    }

    onBuyProperty(payload: any) {
        this.network.send("buy_property", payload);
        this.network.onMessage("property_purchased", (payload) => {
            console.log("Game state property_purchased: ", payload);
            this.payload = payload;
        });
    }

    onStateUpdate(callback: StateListener) {
        this.listeners.push(callback);
    }

    notifyListeners() {
        console.log("Notifying listeners with game state:", this.network.getRoomState());
        this.listeners.forEach((listener) => listener(this.network.getRoomState(), this.payload));
    }
}
