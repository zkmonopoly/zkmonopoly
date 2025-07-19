import { atom } from "nanostores";

export type GameMode = "lan" | "online";

export const $isPaused = atom<boolean>(false);