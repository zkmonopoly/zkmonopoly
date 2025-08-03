import { Button } from "react-aria-components";
import { ModalWrapper } from "./core/wrappers/modal-wrapper";
import { LuX } from "react-icons/lu";
import { twMerge } from "tailwind-merge";
import { modalStyles } from "./core/styles/modal";
import { useState } from "react";
import { useNavigate } from "react-router";
import { i } from "node_modules/react-router/dist/development/components-DzqPLVI1.d.mts";

export default function EndGame() {
    const [open, setOpen] = useState(true);
    const navigate = useNavigate();
    setTimeout(() => {
        navigate("/");
    }, 5000); // Delay to ensure all messages are processed before ending the game

    return (
        <div>
            <ModalWrapper
                className={twMerge(
                    modalStyles,
                    "[&_.react-aria-Dialog]:max-w-[unset]"
                )}
                isDismissable
                isOpen={open}
                onOpenChange={setOpen}
            >
                <div className="flex flex-col items-center relative min-w-[280px]  gap-2.5">
                    <Button
                        className="absolute right-0 -top-1 hover:bg-white/20 p-2 rounded-full"
                        onPress={() => setOpen(false)}
                    >
                        <LuX />
                    </Button>
                    <div>GAME OVER</div>
                    <div>Thank you for playing!</div>
                    <div>Moving to the main menu in 5 seconds...</div>
                </div>
            </ModalWrapper>
        </div>
    );
}
