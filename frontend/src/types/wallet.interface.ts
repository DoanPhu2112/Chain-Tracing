export interface PortfolioBalance {
    chain: string;
    token: string;
    logo: string | null;
    portfolioPercentage: number;
    price: number; // or number, depending on how the price is handled
    amount: number; // or number, depending on how the amount is handled
    value: number; // or number, depending on how the value is handled
}
export type ERC20Balance = {
    native_token: boolean;
    balance: string;
    token: {
        name: string;
        decimal: number;
        address: string;
        symbol: string;
        logo: string | null;
        possibleSpam: boolean | null;
        verifiedContract: boolean | null;
    };
    usd: {
        price: string;
        price24hrUsdChange: string | null;
        price24hrPercentChange: string | null;
        value: string | null;
        value24hrUsdChange: string | null;
    };
    portfolio: {
        percentage: number;
        percentageRelativeToTotalSupply: number | null;
    };
};

export interface getTransactionsResponse {
    transfers: Transaction[];
}
