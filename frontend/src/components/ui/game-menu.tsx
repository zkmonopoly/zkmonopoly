import { Tabs, TabList, TabPanel } from "react-aria-components";
import { LuPlus, LuSpade } from "react-icons/lu";
import { tabsStyles, tabListStyles, tabPanelStyles } from "./core/styles/tabs";
import TooltipTriggerTab from "./tooltip-trigger-tab";
import { twMerge } from "tailwind-merge";
import { ColorGroupSet } from "../game/core/constants/colors";
import ElectricCompanyCard from "./cards/electric-company-card";
import PropertyCard from "./cards/property-card";
import RailroadPropertyCard from "./cards/railroad-property-card";
import WaterCompanyCard from "./cards/water-company-card";
import { $propertyInfo } from "@/models/property";
import { useStore } from "@nanostores/react";

export default function GameMenu() {
  const propertyInfo = useStore($propertyInfo);

  return (
    <Tabs
      orientation="vertical"
      className={twMerge(tabsStyles, "h-[380px]")}
      selectedKey={"tabCard"}
      onSelectionChange={()=> {}}
    >
      <TabList aria-label="Game menu" className={tabListStyles}>
        <TooltipTriggerTab id="tabCard" text="Card">
          <LuSpade size={16} />
        </TooltipTriggerTab>
        <TooltipTriggerTab id="tabCreate" text="New game">
          <LuPlus size={16} />
        </TooltipTriggerTab>
      </TabList>
      <TabPanel id="tabCard" className={twMerge(
        tabPanelStyles,
        "h-full"
      )}>
        {propertyInfo.group === "railroad" ?
          <RailroadPropertyCard propertyInfo={{
            name: propertyInfo.name
          }}/> : (
            propertyInfo.group === "electric" ?
            <ElectricCompanyCard /> : (
              propertyInfo.group === "water" ?
              <WaterCompanyCard /> : (
                propertyInfo.group == null ?
                null : (
                  ColorGroupSet.has(propertyInfo.group!) &&
                  <PropertyCard
                    propertyInfo={propertyInfo}
                  />
                )
              )
            )
          )
        }
      </TabPanel>
    </Tabs>
  )
}