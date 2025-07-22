import { Button, Input, TooltipTrigger } from "react-aria-components";
import { buttonStyles } from "./core/styles/button";
import { LuShoppingBag, LuShare, LuX } from "react-icons/lu";
import { ModalWrapper } from "./core/wrappers/modal-wrapper";
import { modalStyles } from "./core/styles/modal";
import { twMerge } from "tailwind-merge";
import QRCode from "react-qr-code";
import { textFieldsStyles } from "./core/styles/text-field";
import TooltipWrapper from "./core/wrappers/tooltip-wrapper";
import { useMemo, useState } from "react";
import { GameController } from "@/controllers/game-controller";
import { MessageResponseType } from "../type/message-response-type";

export default function BuyProperty() {
    const [open, setOpen] = useState(false);
    const context = GameController.getInstance();
    // var propertyId = "";
    const [propertyId, setPropertyId] = useState("");
    context
        .getNetwork()
        .onMessage(MessageResponseType.OFFER_BUY_PROPERTY, (message) => {
            // propertyId = message.propertyId;
            setPropertyId(message.propertyId);
            console.log("Property offer:", message);
            setOpen(true);
        });

    const handleBuyProperty = () => {
        context.onBuyProperty({ propertyId: propertyId }, (message) => {
            console.log("Property bought:", message);
            setOpen(false);
        });
    };



    return (
        <>
            {open && (
                <Button className={buttonStyles} onPress={handleBuyProperty}>
                    <LuShoppingBag className="inline-block mb-1" /> Buy
                </Button>
            )}
        </>
    );
}
