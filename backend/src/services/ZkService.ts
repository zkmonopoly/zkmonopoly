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
    private requestMap: Map<
        string,
        { resolve: (response: any) => void; timeout: NodeJS.Timeout }
    >;
    private diceRollCallback:
        | ((result: Array<number>) => void | Promise<void>)
        | null = null; // Track single callback
    private createShuffleGameIdCallback: ((gameId: number) => void) | null = null;
    private constructor(currentRoomId: string) {
        this.currentRoomId = currentRoomId;
        this.ws = new WebSocket(process.env.WS_URL || "ws://localhost:3000", {
            headers: {
                currentRoomId: currentRoomId,
            },
        }); // Connect to Hardhat WebSocket Server
        this.requestMap = new Map();

        this.ws.on("open", () => {
            console.log("[ZKService] Connected to WebSocket Server.");
        });

        this.ws.on("message", (data) => {
            const message = JSON.parse(data.toString());
            console.log("[ZKService] Received WebSocket Message:", message);
            if (message.event === "CONNECTED") {
                console.log(
                    `[ZKService] Connected with clientId: ${message.clientId}`
                );
            }
            if (message.event === "DICE_ROLLED") {
                console.log(
                    `[ZKService] Dice rolled: ${message.result} for Client ${message.clientId}`
                );
            }

            if (message.requestId && this.requestMap.has(message.requestId)) {
                const { resolve, timeout } = this.requestMap.get(
                    message.requestId
                );
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

    public onResultDiceRolled(
        callback: (resultDiceRolled: Array<number>) => void | Promise<void>
    ): void {
        if (this.diceRollCallback) {
        }
        this.ws.removeListener("message", this.handleDiceRollMessage);
        this.diceRollCallback = callback;

        this.ws.on("message", this.handleDiceRollMessage);
    }

    private handleDiceRollMessage = async (data: WebSocket.Data) => {
        const message = JSON.parse(data.toString());
        if (message.event === "RESULT_DICE_ROLLED" && this.diceRollCallback) {
            this.resultDiceRolled.push(message.result);
            console.log("RESULT_DICE_ROLLED", this.resultDiceRolled);

            await this.diceRollCallback(this.resultDiceRolled);
            if (this.resultDiceRolled.length === 2) {
                this.resultDiceRolled = [];
            }
        }
    };

    public removeResultDiceRolledListener(): void {
        if (this.diceRollCallback) {
            this.ws.removeListener("message", this.handleDiceRollMessage);
            this.diceRollCallback = null;
        }
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
        console.log(
            `[ZKService] Rolling dice for RoomID: ${this.currentRoomId}`
        );
        return this.sendRequest("ROLL_DICE", {
            clientId: this.currentRoomId,
            numberOfPlayers: numberOfPlayers,
        });
    }

    private handleCreateShuffleGameId = (data: WebSocket.Data) => {
        const message = JSON.parse(data.toString());
        if (message.event === "CREATE_SHUFFLE_GAME_ID" && this.createShuffleGameIdCallback) {
            console.log(
                `[ZKService] CREATE_SHUFFLE_GAME_ID received: ${message.gameId}`
            );
            this.createShuffleGameIdCallback(message.gameId);
        }
    };

    public removeShuffleGameIdListener(): void {
        if (this.createShuffleGameIdCallback) {
            this.ws.removeListener("message", this.handleCreateShuffleGameId);
            this.createShuffleGameIdCallback = null;
        }
    }

    async onCreateShuffleGameId(callback: (gameId: number) => void): Promise<void> {
        console.log(
            `[ZKService] Waiting for CREATE_SHUFFLE_GAME_ID event for RoomID: ${this.currentRoomId}`
        );
        // Remove existing listener if any
        this.removeShuffleGameIdListener();
        
        this.createShuffleGameIdCallback = callback;
        this.ws.on("message", this.handleCreateShuffleGameId);
    }
}
