import { twJoin } from "tailwind-merge";

export const tooltipStyles = twJoin(
  "shadow-inner rounded-sm bg-sky-400 forced-color-adjust-none outline-none py-0.5 px-2 max-w-37.5",
  "transform-3d transition-[transform,opacity]",
  "entering:transform-[var(--origin)] exiting:transform-[ver(--origin)] entering:opacity-0 exiting:opacity-0",
  "placement-top:mb-2 placement-top:[--origin:translateY(4px)]",
  "placement-bottom:mt-2 placement-bottom:[--origin:translateY(-4px)] placement-bottom:[&_.react-aria-OverlayArrow_svg]:rotate-180",
  "placement-right:ml-2 placement-right:[--origin:translateX(-4px)] placement-right:[&_.react-aria-OverlayArrow_svg]:rotate-90",
  "placement-left:mr-2 placement-left:[--origin:translateX(4px)] placement-left:[&_.react-aria-OverlayArrow_svg]:-rotate-90",
  "[&_.react-aria-OverlayArrow_svg]:block [&_.react-aria-OverlayArrow_svg]:fill-sky-400"
);
