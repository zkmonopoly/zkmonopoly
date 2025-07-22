export interface PlayerState {
    id: string;
    username: string;
    icon: number;
    position: number;
    balance: number;
    properties: Array<string>;
    isInJail: boolean;
    jailTurnsRemaining: number;
    getoutCards: number;
    ready: boolean;
    isBankrupt: boolean;
    aliasName: string; 
  }