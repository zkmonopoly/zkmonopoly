import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";

export class Property extends Schema {
    @type("string")
    id: string;
    @type("number")
    position: number;
    @type("number")
    price: number;
    @type("number")
    rent: number;
    @type(["number"])
    multipliedrent = new ArraySchema<number>();
    @type("number")
    housecost: number;
    @type("string")
    ownedby: string; // Player sessionId or "" if unowned
    @type("string")
    group: string;
    @type("number")
    buildings: number;
    @type("boolean")
    mortgaged: boolean;
}
