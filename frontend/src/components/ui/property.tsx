import { PropertyInfo } from "@/models/property";
import { ColorGroupSet } from "../game/core/constants/colors";
import ElectricCompanyCard from "./cards/electric-company-card";
import PropertyCard from "./cards/property-card";
import RailroadPropertyCard from "./cards/railroad-property-card";
import WaterCompanyCard from "./cards/water-company-card";

interface PropertyProps {
  propertyInfo: PropertyInfo;
}

export default function Property({propertyInfo}: PropertyProps) {
  return (
    propertyInfo.group === "railroad" ?
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
  )
}