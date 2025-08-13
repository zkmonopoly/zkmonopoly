import { Command } from "@colyseus/command";
import { Client } from "@colyseus/core";
import { Player } from "@rooms/state/PlayerState";
import { MonopolyRoom } from "@rooms/MonopolyRoom";
import { Property } from "@rooms/state/PropertyState";

import monopolyJSON from "@/assets/monopoly.json";
import { RoomState } from "../schema/RoomState";
import { MessageResponseTypes } from "@/types/MessageResponseTypes";
import { ZKService } from "@/services/ZkService";
import { FeatureFlagService } from "@/services/FeatureFlagService";
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
        private readonly client: Client<any, any>,
        private readonly data?: { position: number }
    ) {
        super();
    }

    async execute() {
        if (this.monopolyRoom.state.rolledDice) return;
        const player = this.monopolyRoom.state.players.get(
            this.client.sessionId
        );

        var isGameReady = true;

        // number of players that are ready (include the dealer)
        let numberOfPlayersReady = 1;
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
        this.monopolyRoom.state.turns++;

        // For testing purposes, we can set the position directly
        if (this.data && this.data.position > 0) {
            player.position = this.data.position;
            this.handleLandingOnTile(player);
            return;
        }

        // Use the zkService to roll the dice
        if (FeatureFlagService.isDisabled("ZKSHUFFLE")) {
            // make first and second to natural number
            this.handleRollDiceWhenCompleted(Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1);
        } else {
            try {
                ZKService.getInstance(this.monopolyRoom.roomId).removeResultDiceRolledListener();
                ZKService.getInstance(this.monopolyRoom.roomId).onResultDiceRolled(async (result: Array<number>) => {
                    console.log(`Received dice roll result: ${result}`);
                    if (result.length < 2) {
                        await this.handleRollDiceInZkShuffle(numberOfPlayersReady);
                    } else {
                        this.handleRollDiceWhenCompleted(result[0], result[1]);
                        // Clean up listener after handling the complete roll
                        ZKService.getInstance(this.monopolyRoom.roomId).removeResultDiceRolledListener();
                    }
                });

                await this.handleRollDiceInZkShuffle(numberOfPlayersReady);
            } catch (error) {
                console.log(error);
            }
        }

        // // Open it for testing purposes
        // let first;
        // let second;

        // first = Math.floor(Math.random() * 6) + 1;
        // second = Math.floor(Math.random() * 6) + 1;

        // // first = 2;
        // // second = 3;

        // // Set rolledDice to true
        // this.monopolyRoom.state.rolledDice = true;
        // if (first === second) {
        //     if (player.isInJail) {
        //         player.isInJail = false;
        //         this.monopolyRoom.broadcast(
        //             MessageResponseTypes.PLAYER_RELEASED_FROM_JAIL,
        //             {
        //                 playerId: player.id,
        //             }
        //         );
        //         return;
        //     }
        //     // If doubles, allow another turn
        //     this.monopolyRoom.state.currentTurn = this.client.sessionId;
        //     this.monopolyRoom.state.rolledDice = false;
        // } else {
        //     if (player.isInJail && player.getoutCards == 0) {
        //         this.monopolyRoom.broadcast("dice_roll_result", {
        //             first,
        //             second,
        //             position: player.position,
        //             turnId: this.state.currentTurn,
        //         });
        //         return;
        //     } else if (player.isInJail && player.getoutCards > 0) {
        //         player.getoutCards--;
        //         player.isInJail = false;
        //     }
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

    private async handleRollDiceInZkShuffle(numberOfPlayersReady: number) {
        const zkService = ZKService.getInstance(this.monopolyRoom.roomId);
        // Remove any existing listeners
        zkService.removeShuffleGameIdListener();

        await zkService.onCreateShuffleGameId((gameId: number) => {
            console.log(`Received gameId: ${gameId}`);
            // broadcast the gameId to all players
            this.monopolyRoom.broadcast(
                MessageResponseTypes.CREATE_SHUFFLE_GAME_ID,
                {
                    gameId: gameId,
                    requestId: this.client.sessionId,
                    numberOfPlayers: numberOfPlayersReady,
                }
            );
            this.monopolyRoom.state.shuffleGameId = gameId;
            // Clean up the listener after use
            zkService.removeShuffleGameIdListener();
        });

        await zkService.rollDice(numberOfPlayersReady);
    }

    public handleRollDiceWhenCompleted(first: number, second: number) {
        first = (first % 6) + 1;
        second = (second % 6) + 1;
        

        const player = this.monopolyRoom.state.players.get(
            this.client.sessionId
        );

        // Set rolledDice to true
        this.monopolyRoom.state.rolledDice = true;
        if (first === second) {
            if (player.isInJail) {
                player.isInJail = false;
                this.monopolyRoom.broadcast(
                    MessageResponseTypes.PLAYER_RELEASED_FROM_JAIL,
                    {
                        playerId: player.id,
                    }
                );
                return;
            }
            // If doubles, allow another turn
            this.monopolyRoom.state.currentTurn = this.client.sessionId;
            this.monopolyRoom.state.rolledDice = false;
        } else {
            if (player.isInJail) {
                this.monopolyRoom.broadcast("dice_roll_result", {
                    first,
                    second,
                    position: player.position,
                    turnId: this.state.currentTurn,
                });
            }
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

        if (
            !property ||
            property.group === "Special" ||
            property.group === "tax"
        ) {
            // Special tiles like Chance, Jail, Free Parking, etc.
            this.handleSpecialTile(player, tilePosition);
            return;
        }

        if (property.ownedby === "" || property.ownedby === player.id) {
            this.handleAuctionProperties(player, tilePosition, property);
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
                this.monopolyRoom.broadcast(
                    MessageResponseTypes.PLAYER_BANKRUPT,
                    {
                        playerId: player.id,
                    }
                );
            }
        }
    }

    private handleAuctionProperties(
        player: Player,
        position: number,
        property: Property
    ) {
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
                this.monopolyRoom.broadcast(
                    MessageResponseTypes.OFFER_BUY_PROPERTY,
                    {
                        propertyId: property.id,
                        playerId: player.id,
                        property: property,
                    }
                );
            default:
                this.client.send(
                    MessageResponseTypes.OFFER_BUY_PROPERTY,
                    {
                        propertyId: property.id,
                        playerId: player.id,
                        property: property,
                    }
                );
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

                player.balance *= 1 - property.price / 100;

                console.log(
                    `${player.username} paid ${property.price}% in Tax.`
                );
                break;
            case 10: // Visiting Jail
                console.log(`${player.username} is just visiting Jail.`);
                break;
            case 30: // Go to Jail
                player.position = 10;
                player.isInJail = true;
                console.log(`${player.username} was sent to Jail!`);
                this.monopolyRoom.broadcast(
                    MessageResponseTypes.PLAYER_MOVE_TO_JAIL,
                    {
                        playerId: player.id,
                    }
                );
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

    private async drawChanceOrChestCard(player: Player, isChance: boolean) {
        const cardArray = isChance
            ? monopolyJSON.chance
            : monopolyJSON.communitychest;
        const randomCard =
            cardArray[Math.floor(Math.random() * cardArray.length)];

        // Apply the effect of the drawn card
        await this.applyCardEffect(player, randomCard);

        // Broadcast the drawn card to all players

        this.monopolyRoom.broadcast("chance_community_card", {
            randomCard: randomCard,
            is_chance: isChance,
            turnId: this.state.currentTurn,
        });
    }

    private async applyCardEffect(player: Player, card: CommunityChestCard) {
        console.log(`Applying card effect: ${card}`);
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Simulate delay for card effect application
        switch (card.action) {
            case "jail":
                if (card.subaction === "goto") {
                    player.position = 10; // Go to GO
                    player.isInJail = true;
                    console.log(`${player.username} was sent to Jail!`);
                    this.monopolyRoom.broadcast(
                        MessageResponseTypes.PLAYER_MOVE_TO_JAIL,
                        {
                            playerId: player.id,
                        }
                    );
                } else if (card.title === "getout") {
                    player.getoutCards++;
                }
                break;
            case "removefunds":
                player.balance -= card.amount;
                break;
            case "addfunds":
                player.balance += card.amount;
                break;
            case "move":
                if (card?.count) {
                    player.position += card.count;
                    if (player.position >= 40) {
                        player.position -= 40;
                        player.balance += 200;
                    }
                } else {
                    const titleid = card?.titleid;
                    const title = monopolyJSON.properties.find(
                        (tile) => tile.id === titleid
                    );
                    console.log(
                        `Moving player to position: ${card.titleid}, ${title}`
                    );
                    // If title exists, move player to that position
                    if (title) {
                        player.position = title.position;
                    }
                }
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
