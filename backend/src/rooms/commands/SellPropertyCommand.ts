import { Command } from "@colyseus/command";
import { MonopolyRoom } from "@rooms/MonopolyRoom";

interface Data {
    propertyId: string;
    sellEntireProperty: boolean;
    buildingsToSell: number;
}

export class SellPropertyCommand extends Command<
    MonopolyRoom,
    { client: any; monopolyRoom: MonopolyRoom; data: Data }
> {
    execute({
        client,
        monopolyRoom,
        data,
    }: {
        client: any;
        monopolyRoom: MonopolyRoom;
        data: Data;
    }) {
        const player = this.state.players.get(client.sessionId);
        if (!player) {
            console.warn(
                `sell_property: Player not found for client ${client.sessionId}`
            );
            return;
        }

        const property = this.state.properties.get(String(data.propertyId));
        if (!property) {
            console.warn("sell_property: Property not found:", data.propertyId);
            return;
        }

        if (property.ownedby !== client.sessionId) {
            client.send("sell_property_fail", {
                message: "You do not own this property.",
            });
            return;
        }

        // Base sell (or mortgage) value is half the property price
        const halfPrice = Math.floor(property.price / 2);

        player.balance += halfPrice;

        if (property.buildings > 0) {
            player.balance += property.buildings * property.housecost;
            property.buildings = 0;
        }



        property.ownedby = "";

        // remove property from player's properties
        const propertyIndex = player.properties.indexOf(data.propertyId);
        if (propertyIndex > -1) {
            player.properties.splice(propertyIndex, 1);
        }

        monopolyRoom.broadcast("property_sold", {
            propertyId: data.propertyId,
            ownerId: property.ownedby,
        });

        return;

        // // Sell buildings only
        // if (data.buildingsToSell > 0) {
        //     if (property.buildings < data.buildingsToSell) {
        //         client.send("sell_property_fail", {
        //             message: `You only have ${property.buildings} buildings but tried to sell ${data.buildingsToSell}.`,
        //         });
        //         return;
        //     }

        //     property.buildings -= data.buildingsToSell;

        //     const buildingRevenue = data.buildingsToSell * property.housecost;
        //     player.balance += buildingRevenue;

        //     monopolyRoom.broadcast("property_sold", {
        //         propertyId: data.propertyId,
        //         ownerId: property.ownedby,
        //         newBuildings: property.buildings,
        //         newBalance: player.balance,
        //     });

        //     return;
        // }

    }
}
