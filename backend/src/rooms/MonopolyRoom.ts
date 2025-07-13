import { Room, Client } from "@colyseus/core";
import { RoomState } from "@rooms/schema/RoomState";
import { Property } from "@rooms/state/PropertyState";
import { RegisterPlayerCommand } from "./commands/RegisterPlayerCommand";
import { BuyPropertyCommand } from "@rooms/commands/BuyPropertyCommand";
import { SellPropertyCommand } from "@rooms/commands/SellPropertyCommand";
import { Dispatcher } from "@colyseus/command";
import { RollDiceCommand } from "@rooms/commands/RollDiceCommand";
import { MessageRequestTypes } from "@/types/MessageRequestTypes";
import monopolyJSON from "@/assets/monopoly.json";
import { ZKService } from "@/services/ZkService";
import { AuctionCommand } from "@rooms/commands/AuctionCommand";
import { MessageResponseTypes } from "@/types/MessageResponseTypes";

// Reference from: https://github.com/itaylayzer/Monopoly/blob/main/src/assets/server.ts
// https://github.com/itaylayzer/Monopoly/blob/main/src/assets/monopoly.json
export class MonopolyRoom extends Room<RoomState> {
    maxClients = 4;
    state = new RoomState();

    dispatcher = new Dispatcher(this);

    zkService: ZKService;

    onCreate(options: any) {
        this.state = new RoomState();
        this.zkService = ZKService.getInstance(this.roomId);
        monopolyJSON.properties.forEach((prop: any, index: number) => {
            const newProp = new Property();
            newProp.id = prop.id;
            newProp.position = prop.position;
            newProp.price = prop.price;
            newProp.rent = prop.rent;
            console.log("Full JSON Data:", prop.multipliedrent);

            if (Array.isArray(prop.multipliedrent)) {
                prop.multipliedrent.forEach((element: any) => {
                    newProp.multipliedrent.push(element);
                });
            }

            newProp.housecost = prop.housecost;
            newProp.group = prop.group;
            newProp.ownedby = ""; // initially unowned
            newProp.buildings = 0;
            newProp.mortgaged = false;

            // MapSchema uses string keys, so often "prop.id" or index as the key:
            this.state.properties.set(String(prop.id), newProp);
        });

        this.onMessage(MessageRequestTypes.REGISTER, (client, name: string) => {
            // RegisterPlayerCommand

            this.dispatcher.dispatch(new RegisterPlayerCommand(), {
                client: client,
                name: name,
            });

            // Set the current turn if not already assigned.
            if (!this.state.currentTurn) {
                this.state.currentTurn = client.sessionId;
            }

            // Log the connection.
            const time = this.getCurrentTime();
            const logMsg = `${time} [${client.sessionId}] Player "${name}" has connected.`;
            // this.state.logs.push(logMsg);
            console.log(logMsg);

            const player = this.state.players.get(client.sessionId);

            client.send("initial_player", {
                id: client.sessionId,
                turn_id: this.state.currentTurn,
            });

            // Notify all other players of the new player.
            this.broadcast("new_player", player);
        });

        this.onMessage(MessageRequestTypes.READY, (client) => {
            const player = this.state.players.get(client.sessionId);
            if (player) {
                player.ready = true;

                this.broadcast("ready", {
                    id: client.sessionId,
                    state: player.ready,
                });

                // Check if all players are ready.
                let allReady = true;

                // Check if all players are ready.
                for (const sessionId of this.state.players.keys()) {
                    const player = this.state.players.get(sessionId);
                    if (!player.ready) {
                        allReady = false;
                        break;
                    }
                }

                if (allReady) {
                    console.log(
                        "Game has Started, No more Players can join the Server"
                    );
                    this.broadcast("start_game", {});
                    // if (client.sessionId === this.state.currentTurn) {
                    //     client.send(MessageRequestTypes.YOUR_TURN, {});
                    // }
                    // replace foreach to find current turn

                    this.clients.forEach((c) => {
                        if (c.sessionId === this.state.currentTurn) {
                            c.send(MessageRequestTypes.YOUR_TURN, {});
                        }
                    });
                }
            }
        });

        // Message: "roll_dice" – roll dice, update player position, and broadcast the result.
        // Temporary random dice roll implementation, will be replaced with ZK-Shuffle.
        this.onMessage(MessageRequestTypes.ROLL_DICE, (client) => {
            this.dispatcher.dispatch(new RollDiceCommand(this, client));
        });

        this.onMessage(
            MessageRequestTypes.GET_OUT_OF_JAIL,
            (client, option: "card" | "pay") => {
                const player = this.state.players.get(client.sessionId);
                if (!player) return;
                if (!player.isInJail) return;
                if (option === "card") {
                    if (player.getoutCards > 0) {
                        player.getoutCards--;
                        player.isInJail = false;
                        player.jailTurnsRemaining = 0;
                    }
                } else if (option === "pay") {
                    if (player.balance >= 50) {
                        player.balance -= 50;
                        player.isInJail = false;
                        player.jailTurnsRemaining = 0;
                    }
                }
                this.broadcast("get_out_of_jail", {
                    to: client.sessionId,
                    option,
                });
            }
        );

        this.onMessage(
            MessageRequestTypes.AUCTION_BID,
            (
                client,
                data: { propertyId: string; amount: number; action: string }
            ) => {
                this.dispatcher.dispatch(new AuctionCommand(), {
                    action: data.action,
                    propertyId: data.propertyId,
                    bidderId: client.sessionId,
                    amount: data.amount,
                });
            }
        );

        this.onMessage(MessageRequestTypes.FINISH_TURN, (client) => {
            this.state.rolledDice = false;
            const player = this.state.players.get(client.sessionId);
            if (player) {
                const playerIds = [];

                for (const id of this.state.players.keys()) {
                    const player = this.state.players.get(id);
                    if (player && player.balance > 0) {
                        playerIds.push(id);
                    }
                    console.log("Player ID:", playerIds.length);
                }

                if (playerIds.length === 1) {
                    this.broadcast("end-game", {
                        winner: this.state.players.get(playerIds[0]),
                    });
                    return;
                }
                let currentIndex = playerIds.indexOf(client.sessionId);
                currentIndex = (currentIndex + 1) % playerIds.length;
                this.state.currentTurn = playerIds[currentIndex];
                this.broadcast(MessageResponseTypes.PLAYER_FINISHED_TURN, {
                    from: client.sessionId,
                    turnId: this.state.currentTurn,
                    pJson: player,
                });
                const currentClient = this.clients.find(
                    (c) => c.sessionId === this.state.currentTurn
                );
                if (currentClient) {
                    currentClient.send(MessageRequestTypes.YOUR_TURN, {});
                }
            }
        });

        this.onMessage(
            MessageRequestTypes.EXCHANGE,
            (client, args: { balance: number; from: string; to: string }) => {
                const fromPlayer = this.state.players.get(args.from);
                const toPlayer = this.state.players.get(args.to);
                if (fromPlayer && toPlayer) {
                    toPlayer.balance += args.balance;
                    fromPlayer.balance -= args.balance;
                    if (fromPlayer.balance <= 0) {
                        fromPlayer.isBankrupt = true;
                    }
                    let response = {
                        playerId: args.to,
                        pJson: [toPlayer, fromPlayer],
                        bankruptID: fromPlayer.isBankrupt ? args.from : "",
                    };
                    this.broadcast("member_updating", response);
                }
            }
        );

        this.onMessage(
            MessageRequestTypes.BUY_PROPERTY,
            (client, data: { propertyId: string }) => {
                this.dispatcher.dispatch(new BuyPropertyCommand(), {
                    client: client,
                    monopolyRoom: this,
                    data: data,
                });
            }
        );

        this.onMessage(
            MessageRequestTypes.SELL_PROPERTY,
            (
                client,
                data: {
                    propertyId: string;
                    buildingsToSell: number;
                    sellEntireProperty: boolean;
                }
            ) => {
                this.dispatcher.dispatch(new SellPropertyCommand(), {
                    client: client,
                    monopolyRoom: this,
                    data: data,
                });
            }
        );
    }

    onJoin(client: Client, options: any) {
        console.log(client.sessionId, "joined!");
    }

    onLeave(client: Client, consented: boolean) {
        const player = this.state.players.get(client.sessionId);
        if (player) {
            const time = this.getCurrentTime();
            const logMsg = `${time} [${client.sessionId}] Player "${player.username}" has disconnected.`;
            // this.state.logs.push(logMsg);
            console.log(logMsg);
            this.state.players.delete(client.sessionId);

            // If the leaving client was the current turn, update to the next available player.
            if (this.state.currentTurn === client.sessionId) {
                const playerIds = Object.keys(this.state.players).filter(
                    (id) => this.state.players.get(id).balance > 0
                );
                if (playerIds.length > 0) {
                    let index = playerIds.indexOf(client.sessionId);
                    index = (index + 1) % playerIds.length;
                    this.state.currentTurn = playerIds[index];
                }
            }
            this.broadcast("disconnected-player", {
                id: client.sessionId,
                turn: this.state.currentTurn,
            });
            if (Object.keys(this.state.players).length === 0) {
                console.log(
                    "Game has Ended. Server is currently Open to new Players"
                );
            }
        }
    }

    onDispose() {
        console.log("room", this.roomId, "disposing...");
    }

    getCurrentTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, "0");
        const minutes = now.getMinutes().toString().padStart(2, "0");
        return `${hours}:${minutes}`;
    }
}
