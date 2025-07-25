import WebSocket from "ws";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid"; 

dotenv.config();

interface ResultDiceRolledResponse {
  result: number;
}

export class ZKService {
  private static instance: ZKService;
  private ws: WebSocket;
  private currentRoomId: string;
  public resultDiceRolled: Array<number> = [];
  private requestMap: Map<string, { resolve: (response: any) => void, timeout: NodeJS.Timeout }>;

  private constructor(currentRoomId: string) {
    this.currentRoomId = currentRoomId;
    this.ws = new WebSocket(process.env.WS_URL || "ws://localhost:3000", 
      {
        headers: {
          "currentRoomId": currentRoomId
        }
      }
    ); // Connect to Hardhat WebSocket Server
    this.requestMap = new Map();

    this.ws.on("open", () => {
      console.log("[ZKService] Connected to WebSocket Server.");
    });

    this.ws.on("message", (data) => {
      const message = JSON.parse(data.toString());
      console.log("[ZKService] Received WebSocket Message:", message);
      if (message.event === "CONNECTED") {
        console.log(`[ZKService] Connected with clientId: ${message.clientId}`);
      }
      if (message.event === "DICE_ROLLED") {
        console.log(`[ZKService] Dice rolled: ${message.result} for Client ${message
          .clientId}`);
      }

      if (message.requestId && this.requestMap.has(message.requestId)) {
        const { resolve, timeout } = this.requestMap.get(message.requestId);
        clearTimeout(timeout);
        resolve(message);
        this.requestMap.delete(message.requestId);
      }
    });

    this.ws.on("close", () => {
      console.error("[ZKService] WebSocket connection closed.");
    });

    this.ws.on("error", (err) => {
      console.error("[ZKService] WebSocket Error:", err);
    });
  }

  public static getInstance(currentRoom: string): ZKService {
    if (!ZKService.instance) {
      ZKService.instance = new ZKService(currentRoom);
    }
    return ZKService.instance;
  }

  public onResultDiceRolled(callback: (resultDiceRolled: Array<number>) => void): void {
    this.ws.on("message", (data) => {
      const message = JSON.parse(data.toString());
      if (message.event === "RESULT_DICE_ROLLED") {
        this.resultDiceRolled.push(message.result);
        if (this.resultDiceRolled.length === 2) {
          callback(this.resultDiceRolled);
          this.resultDiceRolled = [];
        }
      }
    });
  }

  private async sendRequest(action: string, data: any = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      const requestId = uuidv4();
      const timeout = setTimeout(() => {
        this.requestMap.delete(requestId);
        reject(new Error(`Request timed out: ${action}`));
      }, 500000);

      this.requestMap.set(requestId, { resolve, timeout });
      this.ws.send(JSON.stringify({ action, requestId, ...data }));
    });
  }



  async rollDice(numberOfPlayers: number): Promise<any> {
    console.log(`[ZKService] Rolling dice for RoomID: ${this.currentRoomId}`);
    return this.sendRequest("ROLL_DICE", { clientId: this.currentRoomId, numberOfPlayers:numberOfPlayers });
  }
  
  async onCreateShuffleGameId(callback: any): Promise<any> {
    console.log(`[ZKService] Waiting for CREATE_SHUFFLE_GAME_ID event for RoomID: ${this.currentRoomId}`);
    this.ws.on("message", (data) => {
      const message = JSON.parse(data.toString());
      if (message.event === "CREATE_SHUFFLE_GAME_ID") {
        callback(message.gameId);
        this.resultDiceRolled = [];
      }
    });
  }
}
