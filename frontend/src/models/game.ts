import { atom } from "nanostores";

export type GameMode = "lan" | "online";

export const $isPaused = atom<boolean>(false);

export const $isEndedGame = atom<boolean>(false);