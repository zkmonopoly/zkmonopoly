import { Command } from "@colyseus/command";
import { Client } from "@colyseus/core";
import { Player } from "@rooms/state/PlayerState";
import { MonopolyRoom } from "@rooms/MonopolyRoom";
import { Property } from "@rooms/state/PropertyState";

import monopolyJSON from "@/assets/monopoly.json";
import { RoomState } from "../schema/RoomState";
import { MessageResponseTypes } from "@/types/MessageResponseTypes";
import { ZKService } from "@/services/ZkService";
export const AuctionCallnameList = <const>["alice", "bob", "charlie", "david"];

interface CommunityChestCard {
    title: string;
    action: string;
    subaction?: string;
    titleid?: string;
    amount?: number;
    count?: number;
}

export class RollDiceCommand extends Command<MonopolyRoom> {
    constructor(
        private readonly monopolyRoom: MonopolyRoom,
        private readonly client: Client<any, any>
    ) {
        super();
    }

    async execute() {
        if (this.monopolyRoom.state.rolledDice) return;
        const player = this.monopolyRoom.state.players.get(
            this.client.sessionId
        );
        var isGameReady = true;

        // number of players that are ready
        let numberOfPlayersReady = 0;
        for (const p of this.monopolyRoom.state.players.values()) {
            if (p.ready && !p.isBankrupt) {
                numberOfPlayersReady++;
            }
        }

        this.monopolyRoom.state.players.forEach((p) => {
            if (!p.ready) {
                isGameReady = false;
            }
        });
        if (!player) return;
        if (
            this.monopolyRoom.state.currentTurn !== this.client.sessionId ||
            !isGameReady
        ) {
            return;
        }


        // Broadcast the player rolling the dice
        // this.monopolyRoom.broadcast(MessageResponseTypes.PLAYER_ROLLING_DICE, {
        // });

        // Use the zkService to roll the dice
        try {
            
            ZKService.getInstance(this.monopolyRoom.roomId).onCreateShuffleGameId((gameId: number) => {
                console.log(`Received gameId: ${gameId}`);
                // broadcast the gameId to all players
                this.monopolyRoom.broadcast(MessageResponseTypes.CREATE_SHUFFLE_GAME_ID, {
                    gameId: gameId,
                    requestId: this.client.sessionId,
                    numberOfPlayers: numberOfPlayersReady,
                });
                this.monopolyRoom.state.shuffleGameId = gameId;
            });
            await this.monopolyRoom.zkService.rollDice(numberOfPlayersReady);
            this.monopolyRoom.zkService.onResultDiceRolled((result: Array<number>) => {
                console.log(`Received dice roll result: ${result}`);
                this.handleRollDiceWhenCompleted(result[0], result[1]);
            });

            // const responseSecond = await this.monopolyRoom.zkService.rollDice();
            // first = responseFirst.result;
            // second = await responseSecond.result;
        } catch (error) {
            console.log(error);
        }

        return;

        // let first;
        // let second;


        // first = Math.floor(Math.random() * 6) + 1;
        // second = Math.floor(Math.random() * 6) + 1;

        // // first = 1;
        // // second = 2;

        // // Set rolledDice to true
        // this.monopolyRoom.state.rolledDice = true;
        // if (first === second) {
        //     if (player.isInJail) {
        //         player.isInJail = false;
        //         this.monopolyRoom.broadcast(MessageResponseTypes.PLAYER_RELEASED_FROM_JAIL, {
        //             playerId: player.id,
        //         });
        //         return;
        //     }
        //     // If doubles, allow another turn
        //     this.monopolyRoom.state.currentTurn = this.client.sessionId;
        //     this.monopolyRoom.state.rolledDice = false;
        // }

        // let sum = first + second;
        // let newPosition = player.position + sum;
        // // Check pass GO
        // if (newPosition >= 40) {
        //     newPosition = newPosition % 40;
        //     // Give them money for passing GO
        //     player.balance += 200;
        // }
        // player.position = newPosition;

        // // Check tile
        // this.handleLandingOnTile(player);

        // // broadcast dice roll result
        // this.monopolyRoom.broadcast("dice_roll_result", {
        //     first,
        //     second,
        //     position: player.position,
        //     turnId: this.state.currentTurn,
        // });
    }

    public handleRollDiceWhenCompleted(
        first: number,
        second: number,
    ){
        first += 1;
        second += 1;

        if (first < 1 || first > 6) {
            first = Math.floor(Math.random() * 6) + 1;
        }
        
        if (second < 1 || second > 6) {
            second = Math.floor(Math.random() * 6) + 1;
        }

        const player = this.monopolyRoom.state.players.get(
            this.client.sessionId
        );

        // first = 1;

        // Set rolledDice to true
        this.monopolyRoom.state.rolledDice = true;
        if (first === second) {
            if (player.isInJail) {
                player.isInJail = false;
                this.monopolyRoom.broadcast(MessageResponseTypes.PLAYER_RELEASED_FROM_JAIL, {
                    playerId: player.id,
                });
                return;
            }
            // If doubles, allow another turn
            this.monopolyRoom.state.currentTurn = this.client.sessionId;
            this.monopolyRoom.state.rolledDice = false;
        }

        let sum = first + second;
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
        this.monopolyRoom.broadcast("dice_roll_result", {
            first,
            second,
            position: player.position,
            turnId: this.state.currentTurn,
        });

    } 

    private handleLandingOnTile(player: Player) {
        const tilePosition = player.position;
        const idTitle = monopolyJSON.tiles[tilePosition].id;
        const property = this.state.properties.get(idTitle);

        if (!property || property.group === "Special") {
            // Special tiles like Chance, Jail, Free Parking, etc.
            this.handleSpecialTile(player, tilePosition);
            return;
        }
        
        if (property.ownedby === "" || property.ownedby === player.id) {
            this.handleAuctionProperties(player, tilePosition);
            this.monopolyRoom.broadcast(MessageResponseTypes.OFFER_BUY_PROPERTY, {
                propertyId: property.id,
                playerId: player.id,
            });
        } else if (property.ownedby !== player.id) {
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
                this.monopolyRoom.broadcast(MessageResponseTypes.PLAYER_BANKRUPT, {
                    playerId: player.id,
                });
            }
        }
    }

    private handleAuctionProperties(player: Player, position: number) {
        switch (position) {
            case 12:
            case 28:
            case 5:
            case 15:
            case 25:
            case 35:
                var currentPlayer = 0;
                this.state.numberOfAuctions++;
                for (var player of this.state.players.values()) {
                    if (!player.isBankrupt) {
                        player.aliasName =
                            AuctionCallnameList[
                                currentPlayer % AuctionCallnameList.length
                            ];
                        currentPlayer++;
                    }
                }
        }
    }

    private handleSpecialTile(player: Player, position: number) {
        switch (position) {
            case 0: // GO
                console.log(`${player.username} landed on GO!`);
                break;
            case 4: // Income Tax
            case 38: // Luxury Tax
                // player.balance*(1 - monopolyJSON.properties[position].amount / 100);
                const property = monopolyJSON.properties.find(
                    (tile) => tile.position === position
                );

                player.balance *= (1 - property.price / 100);


                
                console.log(`${player.username} paid ${property.price}% in Tax.`);
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

        this.monopolyRoom.broadcast("chance_community_card", {
            randomCard: randomCard,
            is_chance: isChance,
            turnId: this.state.currentTurn,
        });
    }

    private applyCardEffect(player: Player, card: CommunityChestCard) {
        switch (card.action) {
            case "jail":
                if (card.subaction === "goto") {
                    player.position = 10; // Go to GO
                    player.isInJail = true;
                } else if (card.title === "getout") {
                    player.position = 10;
                    player.isInJail = false;
                }
                break;
            case "removefunds":
                player.balance -= card.amount;
                break;
            case "addfunds":
                player.balance += card.amount;
                break;
            case "move":
                if (card.count > 0) {
                    player.position += card.count;
                    if (player.position >= 40) {
                        player.position -= 40;
                        player.balance += 200;
                    }
                    break;
                }
                else {
                    const titleid = card.title;
                    const title = monopolyJSON.properties.find(
                        (tile) => tile.name === titleid
                    );
                    if (title) {
                        player.position = title.position;
                    }
                }
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
