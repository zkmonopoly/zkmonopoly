import { atom } from "nanostores";
import type { PlayerState } from "@/components/state/player-state";

export const $playerStates = atom<PlayerState[]>([]);