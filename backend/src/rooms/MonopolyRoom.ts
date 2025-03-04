import { Room, Client } from "@colyseus/core";
import { RoomState } from "./schema/RoomState";
import { Player } from "./state/PlayerState";
import { RegisterPlayerCommand } from "./commands/RegisterPlayerCommand";
import { Dispatcher } from "@colyseus/command";

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
            

            // const player = new Player();
            // player.id = client.sessionId;
            // player.username = name;
            // player.icon = Object.keys(this.state.players).length;
            // player.balance = 1500;
            // player.position = this.number_of_players;
            // this.number_of_players += 1;

            // // Add player to state.
            // this.state.players.set(client.sessionId, player);

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

        this.onMessage(
            "ready",
            (client, data: { ready?: boolean}) => {
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
            }
        );
    }

    onJoin(client: Client, options: any) {
        console.log(client.sessionId, "joined!");
    }

    onLeave(client: Client, consented: boolean) {
        console.log(client.sessionId, "left!");
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
