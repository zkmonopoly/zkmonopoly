import { Command } from "@colyseus/command";
import { Player } from "@rooms/state/PlayerState";
import { RoomState } from "@rooms/schema/RoomState";
import { MonopolyRoom } from "@rooms/MonopolyRoom";

export class RegisterPlayerCommand extends Command<MonopolyRoom, { client: any; name: string }> {
    execute({ client, name }: { client: any; name: string }) {
        const player = new Player();
        player.id = client.sessionId;
        player.username = name;
        player.balance = 1500;
        // Temporarily set position to the number of players in the room.
        player.position = this.room.state.players.size;

        this.state.players.set(client.sessionId, player);

        console.log(`Player ${name} has joined with session ID: ${client.sessionId}`);
    }
}
