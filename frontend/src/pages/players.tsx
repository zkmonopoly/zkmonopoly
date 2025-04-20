import { useEffect, useRef, useState } from "react";
import { Player } from "@/components/game/player";
import { PlayerState } from "@/components/state/player-state";
import { GameController } from "@/controllers/game-controller";

export default function Players() {
    const gameController = GameController.getInstance();
    const [playerStates, setPlayerStates] = useState<PlayerState[]>([]); 

    const convertToPlayerData = (p: any): PlayerState => ({
        id: p.id,
        username: p.username,
        icon: p.icon,
        position: p.position,
        balance: p.balance,
        properties: Array.from(p.properties ?? []),
        isInJail: p.isInJail,
        jailTurnsRemaining: p.jailTurnsRemaining,
        getoutCards: p.getoutCards,
        ready: p.ready,
        isBankrupt: p.isBankrupt,
    });

    const updatePlayerState = (state: any) => {
        const playerArray: PlayerState[] = [];
        state.players.forEach((playerSchema: any) => {
            playerArray.push(convertToPlayerData(playerSchema));
        });
        console.log("Player states playerArray: ", playerArray);
        setPlayerStates(playerArray);
    };

    useEffect(() => {
        const roomState = gameController.getNetwork().getRoomState();
        if (roomState) updatePlayerState(roomState);

        // Subscribe to future updates
        gameController.onStateUpdate((roomState, payload) => {
            setTimeout(() => {
                updatePlayerState(roomState);
            }, 1000); // Delay to allow for smoother updates
            });

    }, []);

    return (
        <>
            {playerStates.map((player, index) => (
                <Player
                    key={player.id}
                    playerIndex={index}
                    playerState={player}
                />
            ))}
        </>
    );
}
