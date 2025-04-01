import GameEngine from "./game-engine";
import GameScene from "./game-scene";

export default function Game() {
    return (
        <GameEngine>
            <GameScene />
        </GameEngine>
    );
}
