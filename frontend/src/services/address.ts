import { BackendTransaction, Transaction } from '@/types/transaction.interface'
import { ERC20Balance, PortfolioBalance } from '@/types/wallet.interface';
const prefix = 'http://localhost:3002/account';
function ERC20BalanceToPortfolioBalance(chainID: string, erc20Balances: ERC20Balance[]): PortfolioBalance[] {
    return erc20Balances.map((balance: ERC20Balance): PortfolioBalance => (
        {
            chain: chainID,
            token: balance.token.name,
            logo: balance.token.logo,
            portfolioPercentage: balance.portfolio.percentage,
            price: parseInt(balance.usd.price),
            amount: parseInt(balance.balance),
            value: Number(balance.usd.value) || -1,
        }
    ))
}
export const getAddressBalance = async (address: string): Promise<PortfolioBalance[]> => {
    try {
        const res = await fetch(`${prefix}/balance/erc20/${address}`);
        if (!res.ok) {
            throw new Error('Failed to fetch address balance');
        }
        const data = await res.json();
        console.log(data);
        const chainID = data.metadata.chainID;
        const BEResponseData = data.result;
        const portfolioData = ERC20BalanceToPortfolioBalance(chainID, BEResponseData);
        console.log('TEST portfolioData ', portfolioData);

        return portfolioData; //BE data
    } catch (error) {
        console.error('Error fetching address balance:', error);
        throw error;
    }
};
function transformTransaction(chainId: string, backendTransactions: BackendTransaction[]): Transaction[] {
    console.log("Transform Transaction Called")
    return backendTransactions.map((transaction) => {

        let amount: string = '';
        let asset: string = '';
        let token: string = '';
        if (transaction.value != '0') {
            amount += transaction.value + '\n',
            asset += "Native Token"
            token += 'Native Token' + '\n'
        }
        else if (transaction.nativeTransfers[0]) {
            amount += transaction.nativeTransfers[0].value_formatted;
            asset = transaction.nativeTransfers[0].token.symbol!
            token += transaction.nativeTransfers[0].token.symbol + '\n'

        }
        else if (transaction.erc20Transfers[0]) {
            amount += transaction.erc20Transfers[0].value_formatted 
            asset = transaction.erc20Transfers[0].token_entity.symbol!
            token += transaction.erc20Transfers[0].token_entity.symbol + '\n'

        }
        else if (transaction.nftTransfers[0]) {
            amount += transaction.nftTransfers[0].value;
            asset = transaction.nftTransfers[0].token.name !
            token += transaction.nftTransfers[0].token.name + '\n'
        }
        if (amount === '') {
            console.log('amount', transaction)
        }
        return {
            chainId: chainId,
            from: {
                address: transaction.fromEntity.address,
                entity: transaction.fromEntity.address_entity,
                logo: transaction.fromEntity.address_entity_logo,
                label: transaction.fromEntity.address_entity_label,
            },
            to: {
                address: transaction.toEntity.address,
                entity: transaction.toEntity.address_entity,
                logo: transaction.toEntity.address_entity_logo,
                label: transaction.toEntity.address_entity_label,
            },
            tokenName: token,
            txnHash: transaction.transactionHash,
            type: transaction.methodLabel || transaction.summary, // Map type to methodLabel or summary
            summary: transaction.summary,
            status: 'Confirmed', // You might want to determine status based on certain criteria
            date: new Date(transaction.blockTimestamp).toLocaleDateString(), // Convert timestamp to readable date
            amount: amount,
            asset: asset,
            added: false // Default to false or set based on additional logic
        }
    })
}
export const getAddressTransactions = async (address: string): Promise<Transaction[]> => {
    try {
        const res = await fetch(`${prefix}/transaction/${address}`);
        if (!res.ok) {
            throw new Error('Failed to fetch address transactions');
        }
        const data = await res.json();
        const chainId = data.metadata.chainID
        const BEResponseData = data.result;
        console.log("BEResponseData ", BEResponseData)
        const transactionData: Transaction[] = transformTransaction(chainId, BEResponseData);

        return transactionData;
    } catch (error) {
        console.error('Error fetching address transactions:', error);
        throw error;
    }
};
