import { Color3 } from "@babylonjs/core";

export const NodeColor = Color3.White();
export const MonopolyColors = {
  Orange: Color3.FromHexString("#F49521"),
  Magenta: Color3.Magenta(),
  Red: Color3.Red(),
  Yellow: Color3.Yellow(),
  Green: Color3.Green(),
  Blue: Color3.Blue(),
  Brown: Color3.FromHexString("#8B4513"),
  LightBlue: Color3.FromHexString("#ADD8E6"),
  CommunityChest: Color3.FromHexString("#00B3F1")
};

export const ColorGroupSet = new Set<string>(
  ["orange", "lightblue", "green", "magenta", "red", "yellow", "blue"]
);

export function fromString(str: string | undefined | null) {
  switch (str) {
    case "orange":
      return MonopolyColors.Orange;
    case "lightblue":
      return MonopolyColors.LightBlue;
    case "green":
      return MonopolyColors.Green;
    case "magenta":
      return MonopolyColors.Magenta;
    case "red":
      return MonopolyColors.Red;
    case "yellow":
      return MonopolyColors.Yellow;
    case "blue":
      return MonopolyColors.Blue;
    default:
      throw new Error("No such color");
  }
}