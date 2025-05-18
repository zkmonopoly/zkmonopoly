import { MonopolyColors } from "@/components/game/core/constants/colors";
import { ChanceCard } from "@/components/ui/cards/chance-card";
import { ElectricCompanyCard } from "@/components/ui/cards/electric-company-card";
import { PropertyCard } from "@/components/ui/cards/property-card";
import { RailroadPropertyCard } from "@/components/ui/cards/railroad-property-card";
import { InteractiveConsole } from "@/components/ui/interactive-console";
import { Outlet } from "react-router";

export default function GameLayout() {
  return (
    <div className='flex flex-col min-h-screen antialiased'>
      <div className='flex flex-grow'>
        <div className="w-full grid md:grid-cols-12 relative">
          <div className="md:col-span-3 hidden md:block">
            <div className="flex flex-col justify-center">
              <PropertyCard 
                propertyInfo={{
                  name: "MEDITERRANEAN AVENUE",
                  rent: 2,
                  rentWithColorSet: 4,
                  multipliedRents: [10, 30, 90, 160, 250],
                  houseCost: 50,
                  hotelCost: 50
                }}
                color={MonopolyColors.Brown}
              />
              {/* <ChanceCard body={["ABC", "XYZ"]}/> 
                            <RailroadPropertyCard
                                propertyInfo={{
                                    name: "READING RAILROAD"
                                }}
                            />
                            <ElectricCompanyCard /> */}
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