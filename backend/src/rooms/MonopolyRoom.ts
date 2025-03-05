import { Room, Client } from "@colyseus/core";
import { RoomState } from "./schema/RoomState";
import { Player } from "./state/PlayerState";
import { RegisterPlayerCommand } from "./commands/RegisterPlayerCommand";
import { Dispatcher } from "@colyseus/command";
import monopolyJSON from "@/assets/monopoly.json";

// Reference from: https://github.com/itaylayzer/Monopoly/blob/main/src/assets/server.ts
// https://github.com/itaylayzer/Monopoly/blob/main/src/assets/monopoly.json
export class MonopolyRoom extends Room<RoomState> {
    maxClients = 4;
    state = new RoomState();

    dispatcher = new Dispatcher(this);

    onCreate(options: any) {
        this.state = new RoomState();

        this.onMessage("name", (client, name: string) => {
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
            // Send initials to the joining client.
            const otherPlayers = [];
            for (const key in this.state.players) {
                otherPlayers.push(this.state.players.get(key));
            }
            client.send("initials", {
                turn_id: this.state.currentTurn,
                other_players: otherPlayers,
            });

            // Notify all other players of the new player.
            this.broadcast("new-player", player, { except: client });
        });

        this.onMessage("ready", (client, data: { ready?: boolean }) => {
            const player = this.state.players.get(client.sessionId);
            if (player) {
                if (data.ready !== undefined) {
                    player.ready = data.ready;
                }

                this.broadcast("ready", {
                    id: client.sessionId,
                    state: player.ready,
                });

                // Check if all players are ready.
                let allReady = true;
                for (const key in this.state.players) {
                    if (!this.state.players.get(key).ready) {
                        allReady = false;
                        break;
                    }
                }
                if (allReady) {
                    console.log(
                        "Game has Started, No more Players can join the Server"
                    );
                    this.broadcast("start-game", {});
                }
            }
        });

        // Message: "roll_dice" – roll dice, update player position, and broadcast the result.
        // Temporary random dice roll implementation, will be replaced with ZK-Shuffle.
        this.onMessage("roll_dice", (client) => {
            const player = this.state.players.get(client.sessionId);
            if (!player) return;
            if (this.state.currentTurn !== client.sessionId) return;
            const first = Math.floor(Math.random() * 6) + 1;
            const second = Math.floor(Math.random() * 6) + 1;
            const sum = first + second;
            player.position = (player.position + sum) % 40;
            const time = this.getCurrentTime();
            const logMsg = `${time} [${client.sessionId}] Player "${player.username}" rolled a [${first}, ${second}].`;
            // this.state.logs.push(logMsg);
            console.log(logMsg);
            this.broadcast("dice_roll_result", {
                listOfNums: [first, second, player.position],
                turnId: this.state.currentTurn,
            });
        });

        this.onMessage("unjail", (client, option: "card" | "pay") => {
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
            this.broadcast("unjail", { to: client.sessionId, option });
        });

        // Roll the chance or community chest card.
        this.onMessage(
            "chorch_roll",
            (client, args: { is_chance: boolean; rolls: number }) => {
                const arr = args.is_chance
                    ? monopolyJSON.chance
                    : monopolyJSON.communitychest;
                const randomElement =
                    arr[Math.floor(Math.random() * arr.length)];
                this.broadcast("chorch_result", {
                    element: randomElement,
                    is_chance: args.is_chance,
                    rolls: args.rolls,
                    turnId: this.state.currentTurn,
                });
            }
        );

        this.onMessage(
            "player_update",
            (client, args: { playerId: string; pJson: any }) => {
                const player = this.state.players.get(args.playerId);
                if (player) {
                    player.position = args.pJson.position;
                    player.balance = args.pJson.balance;
                    // Update additional fields as needed.
                    this.broadcast("player_update", args, { except: client });
                }
            }
        );

        this.onMessage("finish-turn", (client, playerInfo: any) => {
            const player = this.state.players.get(client.sessionId);
            if (player) {
                player.position = playerInfo.position;
                player.balance = playerInfo.balance;
                const playerIds = Object.keys(this.state.players).filter(
                    (id) => this.state.players.get(id).balance > 0
                );
                if (playerIds.length === 1) {
                    this.broadcast("end-game", {
                        winner: this.state.players.get(playerIds[0]),
                    });
                    return;
                }
                let currentIndex = playerIds.indexOf(client.sessionId);
                currentIndex = (currentIndex + 1) % playerIds.length;
                this.state.currentTurn = playerIds[currentIndex];
                this.broadcast("turn-finished", {
                    from: client.sessionId,
                    turnId: this.state.currentTurn,
                    pJson: player,
                });
            }
        });

        this.onMessage(
            "exchange",
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

        // Pay money to the bank.
        this.onMessage("pay_bank", (client, amount: number) => {
            const player = this.state.players.get(client.sessionId);
            if (player) {
                player.balance -= amount;
                if (player.balance <= 0) {
                    player.isBankrupt = true;
                }
                this.broadcast("member_updating", {
                    playerId: client.sessionId,
                    pJson: player,
                    bankruptID: player.isBankrupt ? client.sessionId : "",
                });
            }
        });

        // Receive money from the bank.
        this.onMessage("receive_bank", (client, amount: number) => {
            const player = this.state.players.get(client.sessionId);
            if (player) {
                player.balance += amount;
                this.broadcast("member_updating", {
                    playerId: client.sessionId,
                    pJson: player,
                    bankruptID: "",
                });
            }
        });
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
