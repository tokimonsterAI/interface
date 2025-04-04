
import {Contract, ethers} from 'ethers';
import {useCallback, useMemo} from 'react';

import {useAccountContext} from '../../context/AccountContext';
import {BatchContractFetchRequest, ContractFetchRequest, batchContractFetch, contractFetch} from '../../util/contract';
import {AutoFetchOptions, useAutoFetch} from '../use-fetch';

export const useContractFetch = <T>(
    contract?: Contract | null,
    request?: ContractFetchRequest,
    options?: AutoFetchOptions<T>
): ReturnType<typeof useAutoFetch<T>> => {
    const requestString = request && JSON.stringify(request);
    const dataFetcher = useCallback(() => contractFetch(contract, requestString && JSON.parse(requestString)), [contract, requestString]);

    return useAutoFetch<T>(dataFetcher, options);
};

export const useBatchContractFetch = <T>(
    request?: BatchContractFetchRequest,
    options?: AutoFetchOptions<T[] | undefined>
): ReturnType<typeof useAutoFetch<T[] | undefined>> => {
    const dataFetcher = useCallback(() => batchContractFetch<T>(request), [request]);

    return useAutoFetch<T[] | undefined>(dataFetcher, options);
};

export type Provider = ethers.providers.JsonRpcProvider;

export const useContract = (
    address: string | undefined,
    abi: any,
    fallbackProvider?: Provider,
    targetChainId?: number
) => {
    const {active, signer, chainId: signerChainId} = useAccountContext();

    const signerOrProvider = useMemo(() => {
        // if targetChainId is not the same as signerChainId,
        // use fallbackProvider to fetch data
        if (targetChainId && targetChainId !== signerChainId) {
            return fallbackProvider;
        }

        return active ? signer : fallbackProvider;
    }, [active, fallbackProvider, signer, signerChainId, targetChainId]);

    return useMemo(() => {
        if (!address || !signerOrProvider) {
            return null;
        }

        return new Contract(address, abi, signerOrProvider);
    }, [address, signerOrProvider, abi]);
};

export const useContractRO = (
    address: string | undefined,
    abi: any,
    provider?: Provider
) => useMemo(() => address ? new Contract(address, abi, provider) : null, [address, provider, abi]);

export const useContracts = (
    addresses: string[] | undefined,
    abi: any,
    fallbackProvider?: Provider,
    targetChainId?: number
) => {
    const {active, signer, chainId: signerChainId} = useAccountContext();

    const signerOrProvider = useMemo(() => {
        // if targetChainId is not the same as signerChainId,
        // use fallbackProvider to fetch data
        if (targetChainId && targetChainId !== signerChainId) {
            return fallbackProvider;
        }

        return active ? signer : fallbackProvider;
    }, [active, fallbackProvider, signer, signerChainId, targetChainId]);

    const addressesString = addresses && JSON.stringify(addresses);

    return useMemo(() => {
        const parsedAddresses = addressesString && JSON.parse(addressesString) as typeof addresses;
        if (!parsedAddresses || !signerOrProvider) {
            return null;
        }

        return parsedAddresses.map(address => new Contract(address, abi, signerOrProvider));
    }, [addressesString, signerOrProvider, abi]);
};
