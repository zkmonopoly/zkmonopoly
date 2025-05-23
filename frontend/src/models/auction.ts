export interface PlayerBet {
  name: string;
  status: boolean | null;
}

export interface AuctionResult {
  name: string;
}

export interface Auction {
  propertyName?: string;
  bets: PlayerBet[];
  result?: AuctionResult;
}