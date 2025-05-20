import { Tabs, TabList, TabPanel } from "react-aria-components";
import { LuDoorOpen, LuPlus } from "react-icons/lu";
import { tabsStyles, tabListStyles, tabPanelStyles } from "./core/styles/tabs";
import TooltipTriggerTab from "./tooltip-trigger-tab";

export default function GameMenu() {
  return (
    <Tabs
      orientation="vertical"
      className={tabsStyles}
      selectedKey={null}
      onSelectionChange={()=> {}}
    >
      <TabList aria-label="Menu" className={tabListStyles}>
        <TooltipTriggerTab id="tabJoin" text="Join a game">
          <LuDoorOpen size={16} />
        </TooltipTriggerTab>
        <TooltipTriggerTab id="tabCreate" text="New game">
          <LuPlus size={16} />
        </TooltipTriggerTab>
      </TabList>
      <TabPanel id="tabJoin" className={tabPanelStyles}>
      </TabPanel>
    </Tabs>
  )
}