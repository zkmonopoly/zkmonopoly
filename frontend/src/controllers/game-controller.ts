// src/game-controller/GameController.ts
import { Network } from "./network";
import AuctionController, {
    AuctionCallname,
    AuctionCallnameList,
} from "@/controllers/auction-controller";
import { $playerStates } from "@/models/player";
import { Room } from "colyseus.js";
import {
    $auctionIndex,
    $auctionModalOpen,
    $executionTime,
    $winner,
} from "@/models/auction";
import { MessageRequestType } from "@/components/type/message-request-type";
import { MessageResponseType } from "@/components/type/message-response-type";
import { playerRun } from "@/utils/zkshuffle";
import { ethers } from "ethers";
import { $isPaused } from "@/models/game";

// declare global {
//     interface Window {
//         ethereum?: any;
//     }
// }

import { PlayerState } from "@/components/state/player-state";
type StateListener = (roomState: any, payload: any) => void;

interface AuctionConfig {
    pathname: string;
    selectedCommand: AuctionCallname;
}

export class GameController {
    private static instance: GameController | null = null;
    static ROOM_NAME: string = "my_room";

    private static room: Room<any> | undefined;

    private auctionConfig!: AuctionConfig;
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


    }

    async createRoom(name: string, callback: any) {
        const room = await this.getNetwork().createRoom(
            GameController.ROOM_NAME
        );
        GameController.room = room;
        this.onRegister(name);
        callback();
    }

    async joinOrCreateRoom(name: string, callback: any) {
        const room = await this.getNetwork().joinOrCreateRoom(
            GameController.ROOM_NAME
        );
        GameController.room = room;
        this.onRegister(name);
        callback();
    }

    async joinRoomById(roomId: string, name: string, callback: any) {
        const room = await this.getNetwork().joinRoomById(roomId);
        GameController.room = room;

        console.log("Joined room with sessionId:", room);

        this.onRegister(name);
        callback();
    }

    getNetwork() {
        return this.network;
    }

    onRegister(name: string) {
        this.network.send("register", name);
        console.log("Registered player with name:", name);
    }

    onInitialGameMessage(callback: (message: any) => void) {
        console.log("Listening for initial_player message");
        this.network.onMessage("initial_player", (message) => {
            console.log("Game state initial_player: ", message);
            callback(message);
        });

        this.onNewPlayer((message) => {});
    }

    // For General Game Events
    onStartGame(callback: (message: any) => void) {
        console.log("Listening for start_game message");
        this.network.onMessage("start_game", (message) => {
            console.log("Game state start_game: ", message);
            callback(message);
        });


        this.network.onMessage(
            MessageResponseType.CREATE_SHUFFLE_GAME_ID,
            async (message) => {
                const shuffleManagerContract =
                    "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";
                const provider = new ethers.providers.JsonRpcProvider(
                    import.meta.env.VITE_HARDHAT_ENDPOINT ||
                        "http://127.0.0.1:8545"
                );

                // get index of current player
                const playerStates = $playerStates.get();
                const index = playerStates.findIndex(
                    (player) => player.id === this.network.getRoom()?.sessionId
                );
                const owner = provider.getSigner(index + 1);
                const result = await playerRun(
                    shuffleManagerContract,
                    owner,
                    message.gameId
                );

                console.log("Dice rolled by player:", result);
            }
        );
    }

    onYourTurn(callback: (message: any) => void) {
        this.network.onMessage(MessageRequestType.YOUR_TURN, (message) => {
            console.log("Game state your_turn: ", message);
            callback(message);
        });
    }

    onFinishTurn(callback: (message: any) => void) {
        this.network.send(MessageRequestType.FINISH_TURN);
        this.network.onMessage(
            MessageResponseType.PLAYER_FINISHED_TURN,
            (message) => {
                console.log("Game state finish_turn: ", message);
                callback(message);
            }
        );
    }

    onReady(callback: (message: any) => void) {
        this.network.send("ready");
        this.network.onMessage("ready", callback);
    }

    onNewPlayer(callback: (message: any) => void) {
        this.network.onMessage("new_player", (message) => {
            console.log("Game state new_player: ", message);
            callback(message);
        });
    }

    delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
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

            if (
                payload.property.group === "Utilities" ||
                payload.property.group === "Railroad"
            ) {
                // await this.delay(6000);
                // Auction config
                this.auctionConfig = {
                    pathname: GameController.room?.roomId ?? "",
                    selectedCommand: "alice",
                };
                console.log("Auction config set:", this.auctionConfig);

                if (this.auctionConfig.pathname === "") {
                    console.warn("Auction config not set. Skipping auction.");
                    return;
                }
                $auctionModalOpen.set(true);
            }
        });
    }

    sendAuction(bidValue: number) {
        const playerStates = $playerStates.get();
        const totalPlayers = playerStates.filter(
            (player) => !player.isBankrupt
        ).length;
        var currentPlayer = playerStates.find(
            (player) => player.id === this.network.getRoom()?.sessionId
        );
        $auctionIndex.set(
            GameController.getInstance().getNetwork().getRoomState()
                ?.numberOfAuctions || 0
        );

        this.auctionConfig.selectedCommand =
            (currentPlayer?.aliasName as AuctionCallname) || "alice"; // Default to "alice" if not found

        const { pathname, selectedCommand } = this.auctionConfig;

        const auctionController = new AuctionController(
            {
                name: pathname + "_" + $auctionIndex.get(),
                size: totalPlayers,
            },
            selectedCommand,
            this.payload.property.price
        );

        // let bidValue = 210;
        // if (selectedCommand === "bob") bidValue = 220;
        // if (selectedCommand === "charlie") bidValue = 230;
        $auctionModalOpen.set(true);
        const start = Date.now();
        console.log(
            "Sending auction with bid value:",
            bidValue,
            "for player:",
            this.auctionConfig.selectedCommand
        );
        $isPaused.set(true);
        auctionController
            .mpcLargest(bidValue)
            .then((result) => {
                // Handle auction result (e.g., update winner, notify UI)
                console.log("Auction result:", result);

                this.onAuctionResult(result, currentPlayer, bidValue);
                const end = Date.now();
                const executionTime = end - start;
                $executionTime.set(Math.round(executionTime / 1000));
            })
            .catch((err) => {
                console.error("Auction error:", err);
            })
            .finally(() => {
                $isPaused.set(false);
            });
    }

    onRollDice() {
        console.log("Rolling dice...");
        this.network.send("roll_dice");
    }

    onAuctionResult(
        result: any,
        currentPlayer?: PlayerState,
        bidValue?: number
    ) {
        console.log("Auction result received:", result);
        if (result.winner === 0) {
            $winner.set("No winner");
            return;
        }
        const aliasName = AuctionCallnameList[result.winner];
        const playerWinner = $playerStates.get().find((player) => {
            return player.aliasName === aliasName;
        });
        if (playerWinner) {
            $winner.set(playerWinner.username);
            // only winner send the property to the GameController
            if (currentPlayer?.aliasName === aliasName) {
                console.log("Winner is current player:", playerWinner.username);
                GameController.getInstance().onBuyProperty({
                    propertyId: this.payload.property.id,
                    bidValue: bidValue,
                });
            }
        } else {
            $winner.set("Unknown Player");
        }
        // return playerWinner;
    }

    onBuyProperty(payload: any, callback?: (message: any) => void) {
        this.network.send("buy_property", payload);
        console.log("Buying property with payload:", payload);
        this.network.onMessage(MessageResponseType.BUY_PROPERTY_SUCCESS, (payload) => {
            console.log("Game state property_purchased: ", payload);
            callback?.(payload);
            this.payload = payload;
        });
        this.network.onMessage(MessageResponseType.BUY_PROPERTY_FAIL, (message) => {
            console.error("Failed to buy property:", message);
            callback?.(message);
        });
    }

    onStateUpdate(callback: StateListener) {
        this.listeners.push(callback);
    }

    notifyListeners() {
        console.log(
            "Notifying listeners with game state:",
            this.network.getRoomState()
        );
        this.listeners.forEach((listener) =>
            listener(this.network.getRoomState(), this.payload)
        );
    }
}
