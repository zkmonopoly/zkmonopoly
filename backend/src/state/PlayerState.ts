import { Room, Client } from "colyseus";
import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";

export class Player extends Schema {
    @type("string")
    id: string = "";
  
    @type("string")
    username: string = "";
  
    @type("number")
    icon: number = 0;
  
    @type("number")
    position: number = 0;
  
    @type("number")
    balance: number = 1500;
  
    @type(["string"])
    properties = new ArraySchema<string>();
  
    @type("boolean")
    isInJail: boolean = false;
  
    @type("number")
    jailTurnsRemaining: number = 0;
  
    @type("number")
    getoutCards: number = 0;
  
    @type("boolean")
    ready: boolean = false;
  
  }
  