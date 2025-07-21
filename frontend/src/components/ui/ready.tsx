import { Button } from "react-aria-components";
import { buttonStyles } from "./core/styles/button";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { GameController } from "@/controllers/game-controller";
import { LuHand, LuThumbsUp } from "react-icons/lu";

export default function Ready() {
    const context = GameController.getInstance();
    const [ready, setReady] = useState(false);
    const [started, setStarted] = useState(false);
    const [finished, setFinished] = useState(true);
    const handleReady = () => {
        context.onReady((message) => {
            console.log("Player is ready:", message);
            setReady(true);
            context.onYourTurn((message) => {
                console.log("It's your turn:", message);
                setFinished(false);
            });
        });
        context.onStartGame((message) => {
            console.log("Game started:", message);
            setStarted(true);
        });
    };

    const handleFinishTurn = () => {
        context.onFinishTurn((message) => {
            console.log("Turn finished:", message);
            setFinished(true);
        });
    };

    return (
        <>
            {/* hide when ready */}
            {!started && (
                <Button
                    isDisabled={ready}
                    onPress={handleReady}
                    className={twMerge(
                        buttonStyles,
                        "bg-green-500 pressed:bg-green-400"
                    )}
                >
                    <LuHand className="inline-block mb-1"/> Ready
                </Button>
            )}
            {started && (
                <Button
                    isDisabled={finished}
                    onPress={handleFinishTurn}
                    className={twMerge(
                        buttonStyles,
                        "bg-green-500 pressed:bg-green-400"
                    )}
                >
                    <LuThumbsUp className="inline-block mb-1"/> Finish Turn
                </Button>
            )}
        </>
    );
}
