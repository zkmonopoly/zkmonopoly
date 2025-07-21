import { atom } from "nanostores";
import * as MapData from "@/components/game/core/assets/map_data.json";

export interface PropertyInfo {
  name: string;
  position: number;
  price?: number;
  rent?: number;
  multipliedRents?: number[];
  houseCost?: number;
  hotelCost?: number;
  group?: string;
}

export const $propertyInfo = atom<PropertyInfo>({
  name: "go",
  position: 0
});

export interface RailroadPropertyInfo {
  name: string;
}

export const PropertiesMap = new Map(
  MapData.properties.map((property) => [property.position, property])
);