import { Modify } from "@/utils/sugar";
import { ReactNode } from "react";
import { ListBoxItemProps, ListBoxItem, Button, ListBox, Popover, Select, SelectValue, Label, SelectProps } from "react-aria-components";
import { LuCheck, LuChevronsDownUp } from "react-icons/lu";
import { twMerge } from "tailwind-merge";

type SelectWrapperProps = Omit<Modify<SelectProps, {
    className?: string;
    label?: string;
}>, "isDisabled" | "id">;

export default function SelectWrapper({label, className, children, ...props}: SelectWrapperProps) {
  return (
    <Select
      className={twMerge(
        "flex flex-col gap-1",
        className
      )}
      {...props}
      aria-label={label || "Selector"}
      isDisabled={children == null}>
      {label && <Label className="text-xs cursor-default">{label}</Label>}
      <Button className="flex items-center cursor-default rounded-lg border-0 bg-black/90 pressed:bg-black transition py-2 pl-5 pr-2 text-base text-left leading-normal shadow-md text-white focus:outline-hidden ">
        <SelectValue className="flex-1 truncate text-xs"  />
        <LuChevronsDownUp />
      </Button>
      <Popover className="max-h-60 w-(--trigger-width) overflow-auto rounded-md bg-black text-base shadow-lg ring-1 ring-white/5 entering:animate-in entering:fade-in exiting:animate-out exiting:fade-out">
        <ListBox className="p-1 border border-neutral-500">
          {children}
        </ListBox>
      </Popover>
    </Select>
  );
}
  
export function SelectItem({id, className, ...props}: Modify<ListBoxItemProps, { className?: string }> & { children: ReactNode }) {
  return (
    <ListBoxItem
      {...props}
      id={id}
      textValue={id?.toString()}
      className={twMerge("group flex items-center gap-2 cursor-default select-none py-2 px-4 outline-hidden rounded-sm text-white focus:bg-rose-600", className)}
    >
      {({ isSelected }) => (
        <>
          <span className="flex-1 flex items-center gap-2 truncate font-normal text-xs">
            {props.children}
          </span>
          <span className="w-5 flex items-center text-white">
            {isSelected && <LuCheck />}
          </span>
        </>
      )}
    </ListBoxItem>
  );
}

 /** 
  * * @deprecated should not be used
  */
export function Status({ className }: { className: string }) {
  return (
    <span
      className={`w-3 h-3 rounded-full border border-solid border-white ${className}`}
    />
  );
}