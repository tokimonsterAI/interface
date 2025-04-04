import {BigNumber} from 'ethers';

// used in boosted pool rewards & transaction
export type BasicTokenInfo = {
    address: string
    symbol?: string
    decimals?: number
    amount?: BigNumber
    usd?: BigNumber // must be 18 decimals
}

export type ClaimBotConfig = {
    key: string
    chainId: string
    poolIds: string
    timeInterval: string
}
