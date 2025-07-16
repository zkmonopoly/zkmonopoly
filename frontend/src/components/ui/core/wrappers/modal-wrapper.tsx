import {Modify} from "@/utils/sugar.ts";
import {Dialog, Modal, ModalOverlay, ModalOverlayProps} from "react-aria-components";
import {ReactNode} from "react";

type ModalWrapperProps = Modify<ModalOverlayProps, {
  className?: string;
  children?: ReactNode;
}>;

export function ModalWrapper({className, children, ...props}: ModalWrapperProps) {
  return (
    <ModalOverlay className={className} {...props}>
      <Modal>
        <Dialog aria-label="modal">
          {children}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}