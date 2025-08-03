import { PropertyInfo } from "@/models/property";
import { ColorGroupSet } from "../game/core/constants/colors";
import ElectricCompanyCard from "./cards/electric-company-card";
import PropertyCard from "./cards/property-card";
import RailroadPropertyCard from "./cards/railroad-property-card";
import WaterCompanyCard from "./cards/water-company-card";
import CommunityChestCard from "./cards/community-chest-card";
import { u } from "node_modules/react-router/dist/development/route-data-DjzmHYNR.d.mts";
import { useStore } from "@nanostores/react";
import { $chanceCommunityState } from "@/models/chance-community";

interface PropertyProps {
    propertyInfo: PropertyInfo;
}

export default function Property({ propertyInfo }: PropertyProps) {
    useStore($chanceCommunityState);

    return propertyInfo.group === "railroad" ? (
        <RailroadPropertyCard
            propertyInfo={{
                name: propertyInfo.name,
            }}
        />
    ) : propertyInfo.group === "electric" ? (
        <ElectricCompanyCard />
    ) : propertyInfo.group === "water" ? (
        <WaterCompanyCard />
    ) : propertyInfo.group === "chance" ||
      propertyInfo.group === "communitychest" ? (
        <CommunityChestCard body={[$chanceCommunityState.get().title + " *If moving, immune the new position"]} name={"COMMUNITY - CHANCE"} />

    ) : propertyInfo.group === "tax" ? (
        <CommunityChestCard body={[propertyInfo.name]} name={"TAX"} />
    ) : propertyInfo.group == null ? null : (
        ColorGroupSet.has(propertyInfo.group!) && (
            <PropertyCard propertyInfo={propertyInfo} />
        )
    );
}
