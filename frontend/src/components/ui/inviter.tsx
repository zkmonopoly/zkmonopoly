import { Button, DialogTrigger, Input, TooltipTrigger } from "react-aria-components";
import { buttonStyles } from "./core/styles/button";
import { LuCopy, LuShare } from "react-icons/lu";
import { ModalWrapper } from "./core/wrappers/modal-wrapper";
import { modalStyles } from "./core/styles/modal";
import { twMerge } from "tailwind-merge";
import QRCode from "react-qr-code";
import { textFieldsStyles } from "./core/styles/text-field";
import TooltipWrapper from "./core/wrappers/tooltip-wrapper";
import { useMemo } from "react";

export default function Inviter() {
  const url = useMemo(() => {
    return `${window.location.origin}?code=${window.location.pathname.split("/").at(2)}`;
  }, []);
  return (
    <DialogTrigger>
      <Button className={buttonStyles}>
        <LuShare className="inline-block mb-1"/> Invite
      </Button>
      <ModalWrapper className={twMerge(modalStyles, "[&_.react-aria-Dialog]:max-w-[unset]")} isDismissable>
        <div className="flex flex-col items-center">
          <div>INVITE</div>
          <div>
            <div>Scan this code:</div>
            <QRCode value={url} className="border"/>
          </div>
          <div className="mt-2">
            <div>Or copy this URL:</div>
            <div className={twMerge(textFieldsStyles, "flex-row max-w-[256px]")}>
              <Input value={url} readOnly className="!rounded-e-none min-w-0"/>
              <TooltipTrigger>
                  <Button onPress={() => navigator.clipboard.writeText(url)} className={twMerge(buttonStyles, "rounded-s-none min-w-fit" )}>
                    <LuCopy className="mb-1 inline"/> Copy
                  </Button>
                  <TooltipWrapper placement="right">Copy</TooltipWrapper>
              </TooltipTrigger>
            </div>
          </div>
        </div>
      </ModalWrapper>
    </DialogTrigger>
    
  )
}