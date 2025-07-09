import { twJoin } from "tailwind-merge";

export const modalStyles = twJoin(
  "fixed top-0 left-0 w-screen h-screen",
  "bg-black/50 flex items-center justify-center z-100",
  "data-[entering]:animate-modal-fade-in data-[exiting]:animate-modal-fade-out",
  "[&_.react-aria-Dialog]:shadow-lg [&_.react-aria-Dialog]:rounded-md [&_.react-aria-Dialog]:bg-black [&_.react-aria-Dialog]:outline-none [&_.react-aria-Dialog]:max-w-[300px]",
  "[&_.react-aria-Dialog]:data-[entering]:animate-modal-zoom",
  "[&_.react-aria-TextField]:mb-2",
  "[&_.react-aria-Dialog]:p-4"
);