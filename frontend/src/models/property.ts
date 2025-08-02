import { atom } from "nanostores";
import * as MapData from "@/components/game/core/assets/map_data.json";
import { Vector3 } from "@babylonjs/core";

export interface PropertyInfo {
  name: string;
  id?: string;
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
  position: 0,
});


export interface RailroadPropertyInfo {
  name: string;
}

export const PropertiesMap = new Map(
  MapData.properties.map((property) => [property.position, property])
);

export const IdPropertiesMap = new Map(
  MapData.properties.map((property) => [property.id, property])
);

export interface House {
  position: number;
  building: number;
}

export const $house = atom<House | null>(null);