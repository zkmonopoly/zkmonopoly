import { Command } from "@colyseus/command";
import { Client } from "@colyseus/core";
import { Player } from "@rooms/state/PlayerState";
import { MonopolyRoom } from "@rooms/MonopolyRoom";
import { Property } from "@rooms/state/PropertyState";

import monopolyJSON from "@/assets/monopoly.json";

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
        if (!player) return;
        if (this.monopolyRoom.state.currentTurn !== this.client.sessionId) {
            return;
        }

        let first;
        let second;

        try {
            const responseFirst = await this.monopolyRoom.zkService.rollDice();
            const responseSecond = await this.monopolyRoom.zkService.rollDice();
            first = responseFirst.result;
            second = await responseSecond.result;
        } catch (error) {
            console.log(error);
        }

        // const first = Math.floor(Math.random() * 6) + 1;
        // const second = Math.floor(Math.random() * 6) + 1;

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

        // Set rolledDice to true
        this.monopolyRoom.state.rolledDice = true;
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

        if (property.ownedby === "") {
            this.client.send("offer_buy_property", {
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
                this.monopolyRoom.broadcast("player_bankrupt", {
                    playerId: player.id,
                });
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

        this.monopolyRoom.broadcast("chance_community_card", {
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
            case "move":
                player.position += card.count;
                if (player.position >= 40) {
                    player.position -= 40;
                    player.balance += 200;
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
