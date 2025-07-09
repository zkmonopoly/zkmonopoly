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