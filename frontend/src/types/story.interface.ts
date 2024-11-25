export interface AssetDetail {
    asset: string;
    type: string;
}

export interface Event {
    time: string;
    description: string;
    [key: string]: AssetDetail[] | string;

}

export interface StoryTransaction {
    date: string;
    events: Event[];
}