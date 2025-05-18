import { twJoin } from "tailwind-merge";

export const tabsStyles = "flex";
export const tabListStyles = "flex orientation-vertical:flex-col orientation-vertical:border-e-[1px] orientation-vertical:*:border-e-[3px] orientation-vertical:*:border-sky-400/0";
export const tabStyles = twJoin(
  "p-2.5 cursor-default outline-none relative transition-colors border-transparent forced-color-adjust-none",
  "hover:text-neutral-300 focus:text-neutral-300",
  "selected:border-sky-400",
  "disabled:text-neutral-600 disabled:selected:border-neutral-600",
  "focus-visible:after:content-[''] focus-visible:after:absolute focus-visible:after:inset-1 focus-visible:after:rounded-sm focus-visible:after:border-2 focus-visible:after:border-sky-400"
);
export const tabPanelStyles = "p-4 mt-1 rounded-sm outline-none focus-visible:ring-[2px] focus-visible:ring-sky-400";