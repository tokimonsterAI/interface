import useBatchProvider from '@shared/fe/hook/use-batch-provider/v2';

// import useBatchProviderV3 from '@shared/fe/hook/use-batch-provider/v3';

import {Network, getNetwork} from 'src/contracts/networks';

// const useBatchProvider = isLocalHost() ? useBatchProviderV3 : useBatchProviderV2;
export const useRPCProvider = (network: Network) => useBatchProvider(network.chainId, network.rpcUrls);

export const useRPCProviderByChainId = (chainId: number) => {
    const network = getNetwork(chainId);

    if (!network) {
        throw new Error(`Unknown chainId ${chainId}`);
    }

    return useRPCProvider(network);
};
