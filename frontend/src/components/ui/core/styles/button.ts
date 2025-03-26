import { twJoin } from "tailwind-merge";

export const buttonStyles = twJoin(
    "bg-sky-400 border border-neutral-500 rounded-md appearance-none align-middle text-center text-base m-0 outline-none px-2.5 py-1.5 no-underline", 
    "pressed:shadow-inner pressed:bg-sky-300",
    "focus-visible:outline-2 focus-visible:ring-white focus-visible:-outline-offset-1"
);