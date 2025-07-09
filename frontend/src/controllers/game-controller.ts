// src/game-controller/GameController.ts
import { Network } from "./network";
import AuctionController, { AuctionCallname, AuctionCallnameList } from "@/controllers/auction-controller";
import { useStore } from "@nanostores/react";
import { $playerStates } from "@/models/player";
import { Room } from "colyseus.js";
import { timeStamp } from "console";

type StateListener = (roomState: any, payload: any) => void;

interface AuctionConfig {
  pathname: string;
  auctionIndex: number;
  selectedCommand: AuctionCallname;
  setDataCount: (n: number) => void;
}

export class GameController {
  private static instance: GameController | null = null;
  static ROOM_NAME:string = "my_room";

  private static room: Room<any> | undefined;

  private auctionConfig?: AuctionConfig;
  private network: Network;
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
  

    // this.joinGame("Simi");
  }

  async createRoom(name: string, callback: any) {
    const room = await this.getNetwork().createRoom(GameController.ROOM_NAME);
    GameController.room = room;
    this.onRegister(name);
    this.onReady();
    callback();
  }

  async joinOrCreateRoom(name: string, callback: any) {
    const room = await this.getNetwork().joinOrCreateRoom(GameController.ROOM_NAME);
    GameController.room = room;
    this.onRegister(name);
    this.onReady();
    callback();

  }

  async joinRoomById(roomId: string, name: string, callback: any) {
    const room = await this.getNetwork().joinRoomById(roomId);
    GameController.room = room;

    console.log("Joined room with sessionId:", room);

    this.onRegister(name);
    this.onReady();
    callback();
  }

  getNetwork() {
    return this.network;
  }



  readyPlay(){
    console.log("Player ready...");
    this.onReady();
  }

  onRegister(name: string) {
    this.network.send("register", name);
    console.log("Registered player with name:", name);
    // this.network.onMessage("initials", (payload) => {
    //     console.log("Game state: register: ", payload);
    //     this.payload = payload;
    // });
  }

  onInitialGameMessage(callback: (message: any) => void){
    console.log("Listening for initial_player message");
    this.network.onMessage("initial_player", (message) => {
      console.log("Game state initial_player: ", message);
      callback(message);
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
    this.network.onMessage("disconnected-player", (payload) => {
      console.log("Game state disconnected-player: ", payload);
      this.payload = payload;
    });
  }
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Component A, B, C listen to dice_roll_result 
  // -> change state of A B C 

  onDiceRollResultMessage(callback: (message: any) => void) {
    console.log("Listening for dice_roll_result message");
    this.network.onMessage("dice_roll_result", (message) => {
      console.log("Game state dice_roll_result: ", message);
      callback(message);
    });

    this.network.onMessage("offer_buy_property", async (payload) => {
      console.log("Game state offer_buy_property: ", payload);
      this.payload = payload;

      if (payload.property.group === "Utilities" || payload.property.group === "Railroad") {
        await this.delay(6000);
        // Auction config
        this.auctionConfig = {
          pathname: GameController.room?.roomId ?? "",
          auctionIndex: 0,
          selectedCommand: "alice", 
          setDataCount: (n: number) => {
            console.log("Data count set to:", n, new Date());
          }
        };
        console.log("Auction config set:", this.auctionConfig);

        if (this.auctionConfig.pathname === "") {
          console.warn("Auction config not set. Skipping auction.");
          return;
        }

        // this.auctionConfig.selectedCommand = $playerStates.get()[0].aliasName as AuctionCallname; // Default to first player alias
        // get current player by using session id
        const playerStates = $playerStates.get();
        var currentPlayer = playerStates.find(player => player.id === this.network.getRoom()?.sessionId);
        console.log("Current player:", currentPlayer);
        const totalPlayers = playerStates.filter(player => !player.isBankrupt).length;        
        this.auctionConfig.selectedCommand = currentPlayer?.aliasName as AuctionCallname || "alice"; // Default to "alice" if not found
        // total players that not bankrupt
        const { pathname, auctionIndex, selectedCommand, setDataCount } = this.auctionConfig;
        const auctionController = new AuctionController(
          {
            name: pathname + "_" + auctionIndex,
            size: totalPlayers
          },
          selectedCommand,
          setDataCount
        );

        console.log("AuctionController initialized with config:", auctionController);
        let bidValue = 10;
        if (selectedCommand === "bob") bidValue = 15;
        if (selectedCommand === "charlie") bidValue = 24;
        auctionController.mpcLargest(bidValue).then((result) => {
          // Handle auction result (e.g., update winner, notify UI)
          console.log("Auction result:", result);
          this.onAuctionResult(result);
          
          if (this.auctionConfig) {
            this.auctionConfig.auctionIndex++;
          }
        }).catch((err) => {
          console.error("Auction error:", err);
        });
      }
    });
  }


  onRollDice() {
    console.log("Rolling dice...");
    this.network.send("roll_dice");
  }

  onAuctionResult(result: any) {
    console.log("Auction result received:", result);

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
