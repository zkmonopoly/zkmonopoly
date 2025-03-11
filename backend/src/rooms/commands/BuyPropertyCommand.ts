import { Command } from "@colyseus/command";
import { MonopolyRoom } from "@rooms/MonopolyRoom";

interface Data {
    propertyId: string;
}

export class BuyPropertyCommand extends Command<MonopolyRoom, { client: any; monopolyRoom: MonopolyRoom; data: Data }> {
    execute({ client, monopolyRoom, data }: { client: any; monopolyRoom: MonopolyRoom; data: Data }) {
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

                monopolyRoom.broadcast("property_updating", {
                    propertyId,
                    newBuildings: property.buildings,
                    newBalance: player.balance,
                });
                return;
            } else {
                client.send("buy_property_fail", {
                    reason: "Cannot buy more buildings on this property.",
                });
            }
            return;
        }

        if (player.balance < property.price) {
            client.send("buy_property_fail", {
                reason: "Not enough balance to purchase this property.",
            });
            return;
        }

        player.balance -= property.price;
        property.ownedby = client.sessionId;

        monopolyRoom.broadcast("property_purchased", {
            propertyId,
            ownerId: client.sessionId,
            newBalance: player.balance,
        });

        console.log(
            `${player.username} purchased property at position ${property.position}`
        );

    }
}
