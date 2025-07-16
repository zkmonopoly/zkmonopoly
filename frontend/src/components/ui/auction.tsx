import {
    $auctionIndex,
    $auctionModalOpen,
    $connectionStatus,
    $dataCount,
    $executionTime,
    $winner,
    type Auction,
} from "@/models/auction";
import { ModalWrapper } from "./core/wrappers/modal-wrapper";
import { modalStyles } from "./core/styles/modal";
import { useEffect, useState } from "react";
import { Input, Button } from "react-aria-components";
import { LuCheck, LuSkipForward, LuX } from "react-icons/lu";
import { twJoin, twMerge } from "tailwind-merge";
import { buttonStyles } from "./core/styles/button";
import { textFieldsStyles } from "./core/styles/text-field";
import { useStore } from "@nanostores/react";
import { GameController } from "@/controllers/game-controller";



export default function Auction() {
    const auctionModalOpen = useStore($auctionModalOpen);
    const dataCount = useStore($dataCount);
    const executionTime = useStore($executionTime);
    const winner = useStore($winner);
    const auctionIndex = useStore($auctionIndex);
    const connectionStatus = useStore($connectionStatus);
    const [error, setError] = useState<string>();
    const [bidValue, setBidValue] = useState<number>(0);

    function StatusIndicator() {
        switch (connectionStatus) {
            case "idle":
                return <span className="text-gray-600">Idle</span>;
            case "connecting":
                return <span className="text-blue-600">Connecting</span>;
            case "in-progress":
                return <span className="text-yellow-600">In progress</span>;
            case "completed":
                return <span className="text-green-600">Completed</span>;
            case "error":
                return <span className="text-red-600">Error - {error}</span>;
        }
    }

    useEffect(() => {
        $auctionModalOpen.listen((value) => {
            if (!value) {
                console.log("close auction modal");
                $dataCount.set(0);
                $executionTime.set(0);
                $winner.set("");
                $connectionStatus.set("idle");
                // $auctionIndex.set(0);
                // $auctionIndex.set($auctionIndex.get() + 1);
            }
        });
    }, []);

    return (
        <ModalWrapper
            isOpen={auctionModalOpen}
            className={modalStyles}
            onOpenChange={$auctionModalOpen.set}
            isDismissable={connectionStatus !== "idle" && connectionStatus !== "completed"}
        >
            <div className="flex flex-col rounded-md gap-2 w-[260px] relative">
                <Button
                    className="absolute right-0 -top-1 hover:bg-white/20 p-2 rounded-full"
                    onPress={() => $auctionModalOpen.set(false)}
                    isDisabled={connectionStatus !== "idle" && connectionStatus !== "completed"}
                >
                    <LuX />
                </Button>
                <div className="mt-2 place-self-center text-sm">
                    AUCTION #{auctionIndex}
                </div>
                <div>Property: N/A</div>
                <div>
                    Status: <StatusIndicator />
                </div>
                <div>Alias: {/* add callname here */}</div>
                <div>
                    Winner: <span className="font-bold">{winner}</span>
                </div>
                <div>Data transferred: {dataCount} KB</div>
                <div>Execution time: {executionTime} s</div>
                <div
                    className={twMerge(
                        textFieldsStyles,
                        "flex-row max-w-[256px]"
                    )}
                >
                    <Input
                        type="number"
                        min={0}
                        className="!rounded-e-none min-w-0"
                        disabled={connectionStatus !== "idle" && connectionStatus !== "completed"}
                        onChange={(e) => setBidValue(Number(e.target.value))}
                    />
                    <Button
                        onPress={() => {
                            GameController.getInstance().sendAuction(bidValue);
                        }}
                        isDisabled={connectionStatus !== "idle" && connectionStatus !== "completed"}
                        className={twMerge(
                            buttonStyles,
                            "rounded-s-none min-w-fit"
                        )}
                    >
                        <LuCheck className="mb-1 inline" /> Submit
                    </Button>
                </div>
                <Button
                    className={twJoin(buttonStyles, "w-[256px]")}
                    onPress={() => {
                        GameController.getInstance().sendAuction(0);
                    }}
                    isDisabled={connectionStatus !== "idle" && connectionStatus !== "completed"}
                >
                    <LuSkipForward className="mb-1 inline" /> Skip
                </Button>
            </div>
        </ModalWrapper>
    );
}
