import { twJoin } from "tailwind-merge";

export const textFieldsStyles = twJoin(
    "flex flex-col w-fit",
    "[&>input,textarea]:p-[0.286rem] [&>input,textarea]:m-0 [&>input,textarea]:border [&>input,textarea]:border-neutral-500 [&>input,textarea]:rounded-md [&>input,textarea]:text-[1.143rem] [&>input,textarea]:text-neutral-300",
    "[&>input,textarea]:focus:ring-[2px] [&>input,textarea]:focus:ring-sky-400 [&>input,textarea]:focus:-outline-offset-1"
);