import {getPreferredChainIdFromStorage} from '@shared/fe/util/local-storage';

import arbitrumLogo from 'src/assets/network/Arbitrum.png';
import bscLogo from 'src/assets/network/BscMain.svg';
import ethereumLogo from 'src/assets/network/Ethereum.svg';
import fujiLogo from 'src/assets/network/fuji.svg';
import mumbaiLogo from 'src/assets/network/mumbai.svg';
import optimismLogo from 'src/assets/network/Optimism.svg';
import sepoliaLogo from 'src/assets/network/Sepolia.png';
import AddressStakeLpMap from 'src/contracts/address-stake-lp.json';
import {isInBrowser, isTestOrDevEnv} from 'src/utils/env';

const {ethereum = {}} = isInBrowser ? window as any : {};

export type Network = {
    chainId: number
    chainName: string
    rpcUrls: string[]
    logoUrl: string
    blockScanUrl: string
    gasSymbol?: string
};

export const ethereumMain: Network = {
    chainId: 1,
    chainName: 'Ethereum',
    rpcUrls: [ // ref: https://chainlist.org/
        'https://ethereum.publicnode.com',
        'https://1rpc.io/eth',
        'https://endpoints.omniatech.io/v1/eth/mainnet/public',
        'https://eth-rpc.gateway.pokt.network',
        'https://rpc.builder0x69.io'
        // 'https://eth.llamarpc.com', // connection closed
        // 'https://eth-mainnet.public.blastapi.io', // CORS error
        // 'https://rpc.payload.de', // 400
        // 'https://rpc.mevblocker.io', // CORS error
        // 'https://rpc.flashbots.net' // CORS error
    ],
    logoUrl: ethereumLogo,
    blockScanUrl: 'https://etherscan.io',
    gasSymbol: 'ETH'
};

export const arbitrum: Network = {
    chainId: 42161,
    chainName: 'Arbitrum',
    rpcUrls: [
        // 'https://arbitrum.blockpi.network/v1/rpc/public', // public batch limit: 10(less than hardcode 100) private: 100
        'https://arbitrum-one.publicnode.com',
        'https://1rpc.io/arb',
        'https://endpoints.omniatech.io/v1/arbitrum/one/public',
        'https://arb1.arbitrum.io/rpc'
    ],
    blockScanUrl: 'https://arbiscan.io',
    logoUrl: arbitrumLogo,
    gasSymbol: 'ETH'
};

export const bscMain: Network = {
    chainId: 56,
    chainName: 'BNB Chain',
    rpcUrls: [
        'https://bsc-dataseed1.ninicoin.io',
        'https://bsc-dataseed3.binance.org',
        // 'https://bsc-dataseed1.defibit.io',
        'https://bscrpc.com',
        'https://bsc.rpc.blxrbdn.com',
        'https://bsc.publicnode.com'
    ],
    blockScanUrl: 'https://bscscan.com',
    logoUrl: bscLogo,
    gasSymbol: 'BNB'
};

export const optimism: Network = {
    chainId: 10,
    chainName: 'Optimism',
    rpcUrls: [
        'https://rpc.ankr.com/optimism',
        'https://optimism-mainnet.public.blastapi.io'
    ],
    blockScanUrl: 'https://optimistic.etherscan.io',
    logoUrl: optimismLogo,
    gasSymbol: 'ETH'
};

/**
 * Below are test chains
 */

export const fuji: Network = {
    chainId: 43113,
    chainName: 'Fuji',
    rpcUrls: [
        'https://rpc.ankr.com/avalanche_fuji',
        'https://endpoints.omniatech.io/v1/avax/fuji/public'
    ],
    logoUrl: fujiLogo,
    blockScanUrl: 'https://testnet.snowtrace.io',
};

export const mumbai: Network = {
    chainId: 80001,
    chainName: 'Mumbai',
    rpcUrls: [
        'https://polygon-testnet.public.blastapi.io',
        'https://polygon-mumbai.blockpi.network/v1/rpc/public'
    ],
    logoUrl: mumbaiLogo,
    blockScanUrl: 'https://mumbai.polygonscan.com',
};

// Pendle Prelaunch Campaign test chain
export const sepolia: Network = {
    chainId: 11155111,
    chainName: 'Sepolia',
    rpcUrls: [ // ref: https://rpc.sepolia.dev
        'https://rpc.sepolia.org',
        'https://rpc2.sepolia.org'
    ],
    logoUrl: sepoliaLogo,
    blockScanUrl: 'https://sepolia.etherscan.io',
};

export const bscTestnet: Network = {
    chainId: 97,
    chainName: 'BSC Testnet',
    rpcUrls: [
        'https://bsc-testnet.public.blastapi.io',
        'https://data-seed-prebsc-1-s2.binance.org:8545',
        'https://data-seed-prebsc-2-s2.binance.org:8545',
        'https://data-seed-prebsc-1-s1.binance.org:8545',
        'https://data-seed-prebsc-2-s1.binance.org:8545',
        'https://data-seed-prebsc-1-s3.binance.org:8545',
        'https://data-seed-prebsc-2-s3.binance.org:8545'
    ],
    logoUrl: bscLogo,
    blockScanUrl: 'https://testnet.bscscan.com',
    gasSymbol: 'BNBT'
};

const NETWORK_LIST: Network[] = [
    ethereumMain,
    arbitrum,
    bscMain,
    optimism,

    fuji,
    mumbai,
    sepolia,
    bscTestnet
];

export const getSupportedChainIds = () => [
    ...(isTestOrDevEnv()
        ? [bscMain.chainId]
        : [bscMain.chainId])
];

export const isSupportedChainId = (chainId: number | undefined) => !!chainId && getSupportedChainIds().includes(chainId);

export const getDefaultChainId = () => getSupportedChainIds()[0];

export const getDefaultNetwork = () => getNetwork(getDefaultChainId()) as Network;

export const getNetwork = (chainId: number | undefined) => {
    return NETWORK_LIST.find(network => network.chainId === chainId);
};

export const getSupportedNetwork = (chainId: number | undefined) => {
    return isSupportedChainId(chainId) ? NETWORK_LIST.find(network => network.chainId === chainId) : undefined;
};

export const getAllSupportedNetworks = () => NETWORK_LIST.filter(({chainId}) => isSupportedChainId(chainId));

export const getSupportedOrDefaultNetwork = (chainId?: number | undefined) => {
    return getSupportedNetwork(chainId) || getSupportedNetwork(getPreferredChainIdFromStorage()) || getDefaultNetwork();
};

export const getAddressStakeLpMap = (chainId: number) => {
    const map = (AddressStakeLpMap as any)?.[chainId];

    if (!map) {
        throw new Error(`AddressStakeLpMap not found for chinaId ${chainId}`);
    }

    return map;
};

type GetAddressOptions = {
    lowerCase?: boolean
}

export const getAddress = (chainId: number | undefined, key: string, options?: GetAddressOptions): string | undefined => {
    if (!chainId) {
        return;
    }

    const map = getAddressStakeLpMap(chainId);

    return options?.lowerCase ? map[key]?.toLowerCase() : map[key];
};

export const bulkGetAddress = (chainId: number | undefined, keys: string[], options?: GetAddressOptions): (string | undefined)[] => {
    return keys.map(key => getAddress(chainId, key, options));
};

export const getAddressStrict = (chainId: number, key: string, options?: GetAddressOptions): string => {
    const address = getAddress(chainId, key, options);
    if (!address) {
        throw new Error(`Address not found for key ${key} in chainId ${chainId}`);
    }

    return address;
};

export interface WatchAssetOptions {
    address: string
    symbol: string
    decimals: number
    image?: string
    chainId?: number
}

// ref: https://eips.ethereum.org/EIPS/eip-747
export const addWatchAsset = async (options: WatchAssetOptions) => ethereum.request({
    method: 'wallet_watchAsset',
    params: {
        type: 'ERC20',
        options
    }
});
