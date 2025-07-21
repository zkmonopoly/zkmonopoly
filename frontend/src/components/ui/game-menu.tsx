import { Key, Tabs, TabList, TabPanel, TabsContext } from "react-aria-components";
import { LuSettings, LuSpade } from "react-icons/lu";
import { tabsStyles, tabListStyles, tabPanelStyles } from "./core/styles/tabs";
import TooltipTriggerTab from "./tooltip-trigger-tab";
import { twMerge } from "tailwind-merge";
import { $propertyInfo } from "@/models/property";
import { useStore } from "@nanostores/react";
import { useState } from "react";
import Property from "./property";

export default function GameMenu() {
  const propertyInfo = useStore($propertyInfo);
  const [selectedKey, onSelectionChange] = useState<Key>("tabCard");

  return (
    <TabsContext.Provider value={{ selectedKey, onSelectionChange }}>
      <Tabs
        orientation="vertical"
        className={twMerge(tabsStyles, "h-[380px]")}
        selectedKey={selectedKey}
        onSelectionChange={onSelectionChange}
      >
        <TabList aria-label="Game menu" className={tabListStyles}>
          <TooltipTriggerTab id="tabCard" text="Card">
            <LuSpade size={16} />
          </TooltipTriggerTab>
          <TooltipTriggerTab id="tabSettings" text="Settings">
            <LuSettings size={16} />
          </TooltipTriggerTab>
        </TabList>
        <TabPanel id="tabCard" className={twMerge(
          tabPanelStyles,
          "h-full"
        )}>
          <Property propertyInfo={propertyInfo}/>
        </TabPanel>
        <TabPanel id="tabSettings" className={twMerge(
          tabPanelStyles,
          "h-full"
        )}>
          
        </TabPanel>
      </Tabs>
    </TabsContext.Provider>
  )
}