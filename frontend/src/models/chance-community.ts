import { atom } from "nanostores";
import * as MapData from "@/components/game/core/assets/map_data.json";

export interface chanceCommunityCard {
  title: string;
}

export const $chanceCommunityState = atom<chanceCommunityCard>({

  title: "Chance Community Card"
});
