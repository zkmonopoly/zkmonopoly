import { Room, Client } from "@colyseus/core";
import { RoomState } from "@rooms/schema/RoomState";
import { Player } from "./state/PlayerState";
import { Property } from "@rooms/state/PropertyState";
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

        this.onMessage("ready", (client) => {
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

            let newPosition = player.position + sum;
            // Check pass GO
            if (newPosition >= 40) {
                newPosition = newPosition % 40;
                // Give them money for passing GO
                player.balance += 200;
            }
            player.position = newPosition;

            // Check tile
            this.handleLandingOnTile(player);

            // broadcast dice roll result
            this.broadcast("dice_roll_result", {
                position: player.position,
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

        this.onMessage("finish-turn", (client, ) => {
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

    private handleLandingOnTile(player: Player) {
        const tilePosition = player.position;
        const idTitle = monopolyJSON.tiles[tilePosition].id;
        const property = this.state.properties.get(idTitle);

        if (!property || property.group === "special") {
            // Special tiles like Chance, Jail, Free Parking, etc.
            this.handleSpecialTile(player, tilePosition);
            return;
        }

        if (property.ownedby === "") {
            // Unowned property → Ask player if they want to buy
            this.broadcast("offer_buy_property", {
                property,
                playerId: player.id,
            });
        } else if (property.ownedby !== player.id && !property.mortgaged) {
            // Owned by another player → Pay rent
            const rentAmount = this.calculateRent(property);
            player.balance -= rentAmount;

            const owner = this.state.players.get(property.ownedby);
            if (owner) {
                owner.balance += rentAmount;
                console.log(
                    `${player.username} paid $${rentAmount} rent to ${owner.username}`
                );
            }

            // If the player is bankrupt, handle bankruptcy
            if (player.balance <= 0) {
                player.isBankrupt = true;
                this.broadcast("player_bankrupt", { playerId: player.id });
            }
        }
    }

    private handleSpecialTile(player: Player, position: number) {
        switch (position) {
            case 0: // GO
                console.log(`${player.username} landed on GO!`);
                break;
            case 4: // Income Tax
                player.balance -= 200;
                console.log(`${player.username} paid $200 in Income Tax.`);
                break;
            case 10: // Visiting Jail
                console.log(`${player.username} is just visiting Jail.`);
                break;
            case 30: // Go to Jail
                player.position = 10;
                player.isInJail = true;
                console.log(`${player.username} was sent to Jail!`);
                break;
            case 2:
            case 17:
            case 33: // Community Chest
                this.drawChanceOrChestCard(player, false);
                break;
            case 7:
            case 22:
            case 36: // Chance
                this.drawChanceOrChestCard(player, true);
                break;
            default:
                console.log(
                    `${player.username} landed on a non-property tile.`
                );
        }
    }

    private drawChanceOrChestCard(player: Player, isChance: boolean) {
        const cardArray = isChance
            ? monopolyJSON.chance
            : monopolyJSON.communitychest;
        const randomCard =
            cardArray[Math.floor(Math.random() * cardArray.length)];

        // Apply the effect of the drawn card
        this.applyCardEffect(player, randomCard);

        // Broadcast the drawn card to all players
        this.broadcast("chorch_result", {
            element: randomCard,
            is_chance: isChance,
            turnId: this.state.currentTurn,
        });
    }

    private applyCardEffect(player: Player, card: any) {
        switch (card.action) {
            case "goto":
                if (card.tileid === "0") {
                    player.position = 0; // Go to GO
                    player.balance += 200;
                } else if (card.tileid === "JAIL") {
                    player.position = 10;
                    player.isInJail = true;
                }
                break;
            case "pay":
                player.balance -= card.amount;
                break;
            case "collect":
                player.balance += card.amount;
                break;
            default:
                console.log(`Unhandled card action: ${card.action}`);
        }
    }

    private calculateRent(property: Property): number {
        if (property.buildings === 0) {
            return property.rent;
        }
        return property.multipliedrent[property.buildings];
    }
}
