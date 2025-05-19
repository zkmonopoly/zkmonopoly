import { ColorGroupSet } from "@/components/game/core/constants/colors";
import { ElectricCompanyCard } from "@/components/ui/cards/electric-company-card";
import { PropertyCard } from "@/components/ui/cards/property-card";
import { RailroadPropertyCard } from "@/components/ui/cards/railroad-property-card";
import { InteractiveConsole } from "@/components/ui/interactive-console";
import { Outlet } from "react-router";
import { useStore } from "@nanostores/react";
import { $propertyInfo } from "@/models/property";
import { WaterCompanyCard } from "@/components/ui/cards/water-company-card";

export default function GameLayout() {
  const propertyInfo = useStore($propertyInfo);

  return (
    <div className='flex flex-col min-h-screen antialiased'>
      <div className='flex flex-grow'>
        <div className="w-full grid md:grid-cols-12 relative">
          <div className="md:col-span-3 hidden md:block">
            <div className="flex flex-col justify-center">
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
            </div>
          </div>
          <div className="md:col-span-9">
            <Outlet />
          </div>
          <InteractiveConsole className="h-full z-10 absolute right-0 top-0 bottom-0" />
        </div>
      </div>
    </div>
  );
}