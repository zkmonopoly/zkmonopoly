import { MonopolyColors } from "@/components/game/core/constants/colors";
import { PropertyCard } from "@/components/ui/cards/property-card";
import { InteractiveConsole } from "@/components/ui/interactive-console";
import { Outlet } from "react-router";

export default function GameLayout() {
    return (
        <div className='flex flex-col min-h-screen antialiased'>
            <div className='flex flex-grow'>
                <div className="w-full grid md:grid-cols-12">
                    <div className="md:col-span-3 hidden md:block relative">
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
                            {/* <RailroadPropertyCard
                                propertyInfo={{
                                    name: "READING RAILROAD"
                                }}
                            />
                            <ElectricCompanyCard /> */}
                        </div>
                        
                        <InteractiveConsole className="w-full absolute left-0 bottom-0 " />
                    </div>
                    <div className="md:col-span-9">
                        {/* <Outlet /> */}
                    </div>
                </div>
            </div>
        </div>
    );
}