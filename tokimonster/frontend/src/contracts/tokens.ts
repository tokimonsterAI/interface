import FujiIcon from 'src/assets/network/fuji.svg';
import MumbaiIcon from 'src/assets/network/mumbai.svg';

import {
    ethereumMain,
    arbitrum,
    fuji,
    mumbai,
    bscMain,
    optimism
} from './networks';

export type TokenInfo = {
    address: string
    decimals: number
    symbol: string
    iconUrl?: string
    isGasToken?: boolean
}

type TokenMap = {
    [key: string]: TokenInfo
}

type NetworkTokenMap = {
    [key: string]: TokenMap
}

export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

type TokenInfoWithoutAddress = Omit<TokenInfo, 'address'>;

const WETH: TokenInfoWithoutAddress = {
    decimals: 18,
    symbol: 'WETH'
};

const SWETH: TokenInfoWithoutAddress = {
    decimals: 18,
    symbol: 'swETH'
};

export const ETHEREUM_MAIN_TOKENS: TokenMap = {
    WETH: {
        ...WETH,
        address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
    },

    SWETH: {
        ...SWETH,
        address: '0xf951e335afb289353dc249e82926178eac7ded78'
    }
};

export const ARBITRUM_TOKENS: TokenMap = {
    USDC: { // https://arbiscan.io/token/0xff970a61a04b1ca14834a43f5de4533ebddb5cc8
        address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
        decimals: 6,
        symbol: 'USDC'
    },

    WETH: {
        ...WETH,
        address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1'
    },

    SWETH: {
        ...SWETH,
        address: '0xbc011a12da28e8f0f528d9ee5e7039e22f91cf18'
    }
};

export const BSC_MAIN_TOKENS: TokenMap = {
    WETH: {
        ...WETH,
        address: '0x2170ed0880ac9a755fd29b2688956bd959f933f8'
    }
};

export const OP_MAIN_TOKENS: TokenMap = {
    WETH: {
        ...WETH,
        address: '0x4200000000000000000000000000000000000006'
    }
};

export const FUJI_TOKENS: TokenMap = {
    AVAX: {
        address: NULL_ADDRESS,
        decimals: 18,
        symbol: 'AVAX',
        iconUrl: FujiIcon,
        isGasToken: true
    }
};

export const MUMBAI_TOKENS: TokenMap = {
    MATIC: {
        address: NULL_ADDRESS,
        decimals: 18,
        symbol: 'MATIC',
        iconUrl: MumbaiIcon,
        isGasToken: true
    }
};

export const NETWORK_TOKENS: NetworkTokenMap = {
    [ethereumMain.chainId]: ETHEREUM_MAIN_TOKENS,
    [arbitrum.chainId]: ARBITRUM_TOKENS,
    [bscMain.chainId]: BSC_MAIN_TOKENS,
    [optimism.chainId]: OP_MAIN_TOKENS,

    [fuji.chainId]: FUJI_TOKENS,
    [mumbai.chainId]: MUMBAI_TOKENS
};
