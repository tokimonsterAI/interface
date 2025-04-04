import {ethers, Contract} from 'ethers';
import {useCallback} from 'react';

import {useAutoFetch} from '@shared/fe/hook/use-fetch';

type EthersEventFilterProps = {
    contractAddress?: string
    abi?: any
    provider?: ethers.providers.Provider
    account?: string
    filterEvent?: string
}

async function fetchLogsInBatchesConcurrent(
    contract: Contract,
    filter: any,
    startBlock: number,
    endBlock = 'latest',
    batchSize = 10000,
    concurrency = 3
) {
    const allLogs = [];
    const promises = [];

    const resolvedEndBlock = (endBlock === 'latest' ? await contract.provider.getBlockNumber() : endBlock) as number;

    for (let fromBlock = startBlock; fromBlock <= resolvedEndBlock; fromBlock += batchSize) {
        const toBlock = Math.min(fromBlock + batchSize - 1, resolvedEndBlock); // 确保不会超出范围

        const promise = (async () => {
            try {
                const logs = await contract.queryFilter(filter, fromBlock, toBlock);

                return logs;
            } catch (error) {
                return [];
            }
        })();

        promises.push(promise);

        if (promises.length >= concurrency) {
            const batchLogs = await Promise.all(promises);
            allLogs.push(...batchLogs.flat());
            promises.length = 0;
        }
    }

    if (promises.length > 0) {
        const batchLogs = await Promise.all(promises);
        allLogs.push(...batchLogs.flat());
    }

    return allLogs;
}

export const useEthersEventFilter = ({
    contractAddress,
    abi,
    provider,
    account,
    filterEvent
}: EthersEventFilterProps) => {
    //用上useAutoFetch
    return useAutoFetch(useCallback(() => {
        if (!contractAddress || !abi || !provider || !account || !filterEvent) {
            return Promise.resolve(undefined);
        }

        const contract = new ethers.Contract(contractAddress, abi, provider);

        const filter = contract.filters?.[filterEvent](null);

        return fetchLogsInBatchesConcurrent(contract, filter, 45757850, 'latest');
    }, [contractAddress, abi, provider, account, filterEvent]), {autoFetch: true});
};
