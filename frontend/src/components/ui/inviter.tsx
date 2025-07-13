import { Button, Input, TooltipTrigger } from "react-aria-components";
import { buttonStyles } from "./core/styles/button";
import { LuCopy, LuShare, LuX } from "react-icons/lu";
import { ModalWrapper } from "./core/wrappers/modal-wrapper";
import { modalStyles } from "./core/styles/modal";
import { twMerge } from "tailwind-merge";
import QRCode from "react-qr-code";
import { textFieldsStyles } from "./core/styles/text-field";
import TooltipWrapper from "./core/wrappers/tooltip-wrapper";
import { useMemo, useState } from "react";

export default function Inviter() {
  const [open, setOpen] = useState(false);
  const url = useMemo(() => {
    return `${window.location.origin}?code=${window.location.pathname.split("/").at(2)}`;
  }, []);
  return (
    <>
      <Button className={buttonStyles} onPress={() => setOpen(true)}>
        <LuShare className="inline-block mb-1"/> Invite
      </Button>
      <ModalWrapper className={twMerge(modalStyles, "[&_.react-aria-Dialog]:max-w-[unset]")} isDismissable isOpen={open} onOpenChange={setOpen}>
        <div className="flex flex-col items-center relative">
          <Button className="absolute right-0 -top-1 hover:bg-white/20 p-2 rounded-full" onPress={() => setOpen(false)}>
            <LuX />
          </Button>
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
    </>
  )
}