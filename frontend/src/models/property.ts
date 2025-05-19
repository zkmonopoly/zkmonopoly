import { atom } from "nanostores";

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