import { atom } from "nanostores";

export interface PlayerBet {
  name: string;
  status: boolean | null;
}

export interface AuctionResult {
  name: string;
}

export interface Auction {
  index: number;
  propertyName?: string;
}

export const $auctionIndex = atom<number>(1);
export const $auctionModalOpen = atom<boolean>(false);
export const $dataCount = atom<number>(0);
export const $winner = atom<string>("");
export const $executionTime = atom<number>(0);