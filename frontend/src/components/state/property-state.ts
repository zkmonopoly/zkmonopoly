
export interface PropertyState {
    id: string;
    position: number;
    price: number;
    rent: number;
    multipliedrent: Array<number>;
    housecost: number;
    ownedby: string; // Player sessionId or "" if unowned
    group: string;
    buildings: number;
    mortgaged: boolean;
}