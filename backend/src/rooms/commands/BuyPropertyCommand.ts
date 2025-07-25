import { Command } from "@colyseus/command";
import { MonopolyRoom } from "@rooms/MonopolyRoom";
import { Client } from "colyseus";

interface Data {
    propertyId: string;
    bidValue: number;
}

export class BuyPropertyCommand extends Command<MonopolyRoom, { client: Client; monopolyRoom: MonopolyRoom; data: Data }> {
    execute({ client, monopolyRoom, data }: { client: Client; monopolyRoom: MonopolyRoom; data: Data }) {
        const player = this.state.players.get(client.sessionId);
        if (!player) {
            console.warn(
                `Could not find player with ID ${client.sessionId}`
            );
            return;
        }

        const { propertyId } = data;
        const property = this.state.properties.get(String(propertyId));
        if (!property) {
            console.warn("Property not found:", propertyId);
            return;
        }

        if (
            property.ownedby !== "" &&
            property.ownedby !== client.sessionId
        ) {
            client.send("buy_property_fail", {
                reason: "Property is already owned.",
            });
            return;
        }

        // Buying buildings on a property
        if (property.ownedby === client.sessionId) {
            if (
                property.buildings < 4 &&
                player.balance >= property.housecost
            ) {
                property.buildings++;
                player.balance -= property.housecost;

                monopolyRoom.broadcast("buy_property_success", {
                    propertyId,
                    ownerId: client.sessionId,
                });
                return;
            } else {
                client.send("buy_property_fail", {
                    message: "Cannot buy more buildings on this property.",
                });
            }
            return;
        }

        if (player.balance < property.price) {
            client.send("buy_property_fail", {
                message: "Not enough balance to purchase this property.",
            });
            return;
        }
        if (property.group === "Utilities" || property.group === "Railroad") {
            const {bidValue} = data;
            property.rent = bidValue;
            player.balance -= bidValue;
        }
        else {
            player.balance -= property.price;
        }

        property.ownedby = client.sessionId;
        player.properties.push(propertyId);

        monopolyRoom.broadcast("buy_property_success", {
            propertyId: propertyId,
            ownerId: client.sessionId,
        });

        console.log(
            `${player.username} purchased property at position ${property.position}`
        );

    }
}
