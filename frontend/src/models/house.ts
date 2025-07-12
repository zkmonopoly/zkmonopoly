import { atom } from "nanostores";

export type House = {
  propertyIndex: number;
  houseCount: number;
}

export const $house = atom<House>({
  propertyIndex: -1,
  houseCount: 0
});