import GameEngine from "./game-engine";
import GameScene from "./game-scene";
import { GameProvider } from "@/contexts/game-context";

export default function Game() {
    return (
        <GameProvider>
            <GameEngine >
                <GameScene />
            </GameEngine>
        </GameProvider>
    );
}
