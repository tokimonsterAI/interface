import {Network} from '@aptos-labs/ts-sdk';
import {useCallback, useEffect, useState, useRef} from 'react';

import {aptosViewFetch, batchAptosViewFetch, AptosContractFetchRequest, BatchAptosViewFetchRequest, getAptosClient} from '../utils/aptos-contract';

export type AutoFetchState<T> = {
    loading: boolean
    error?: Error
    data?: T
}

interface FetchOptions {
    cachePool?: string
    cacheKey?: string
    network?: Network
    deps?: any[]
    skipInitialFetch?: boolean
}

/**
 * 使用Aptos合约视图函数的Hook
 * @param moduleAddress 模块地址
 * @param request 请求参数
 * @param options 选项
 */
export function useContractFetch<T>(
    moduleAddress?: string,
    request?: AptosContractFetchRequest,
    options: FetchOptions = {}
): [T | undefined, () => Promise<void>, AutoFetchState<T>] {
    const {cachePool, cacheKey, network, deps = [], skipInitialFetch = false} = options;
    const [state, setState] = useState<AutoFetchState<T>>({loading: false});
    const client = useRef(network ? getAptosClient(network) : getAptosClient());
    const requestRef = useRef<{moduleAddress?: string; request?: AptosContractFetchRequest}>({
        moduleAddress,
        request
    });

    useEffect(() => {
        requestRef.current = {moduleAddress, request};
    }, [moduleAddress, request]);

    const cacheKeyStr = cachePool && cacheKey ? `${cachePool}:${cacheKey}` : undefined;

    const fetchData = useCallback(async (): Promise<void> => {
        const {moduleAddress: currentModuleAddress, request: currentRequest} = requestRef.current;

        if (!currentModuleAddress || !currentRequest) {
            return;
        }

        if (cacheKeyStr) {
            const cached = sessionStorage.getItem(cacheKeyStr);
            if (cached) {
                try {
                    const data = JSON.parse(cached);
                    setState({loading: false, data});

                    return;
                } catch {
                    // 缓存解析失败，继续获取新数据
                }
            }
        }

        setState(prev => ({...prev, loading: true}));

        try {
            const data = await aptosViewFetch(currentModuleAddress, currentRequest, client.current) as T;

            setState({loading: false, data});

            if (cacheKeyStr && data) {
                try {
                    sessionStorage.setItem(cacheKeyStr, JSON.stringify(data));
                } catch {
                    // 缓存存储失败，不影响主流程
                }
            }
        } catch (error) {
            setState({loading: false, error: error as Error});
        }
    }, [cacheKeyStr, ...deps]);

    useEffect(() => {
        if (!skipInitialFetch) {
            fetchData();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return [state.data, fetchData, state];
}

/**
 * 批量使用Aptos合约视图函数的Hook
 * @param requests 批量请求参数
 * @param options 选项
 */
export function useBatchContractFetch<T>(
    requests?: BatchAptosViewFetchRequest,
    options: FetchOptions = {}
): [T[] | undefined, () => Promise<void>, AutoFetchState<T[]>] {
    const {cachePool, cacheKey, network, deps = [], skipInitialFetch = false} = options;
    const [state, setState] = useState<AutoFetchState<T[]>>({loading: false});
    const client = useRef(network ? getAptosClient(network) : getAptosClient());
    const requestsRef = useRef(requests);
    const initialRef = useRef(true);

    useEffect(() => {
        requestsRef.current = requests;
    }, [requests]);

    const cacheKeyStr = cachePool && cacheKey ? `${cachePool}:${cacheKey}` : undefined;

    const fetchData = useCallback(async (): Promise<void> => {
        const currentRequests = requestsRef.current;

        if (!currentRequests) {
            return;
        }

        if (cacheKeyStr) {
            const cached = sessionStorage.getItem(cacheKeyStr);
            if (cached) {
                try {
                    const data = JSON.parse(cached);
                    setState({loading: false, data});

                    return;
                } catch {
                    // 缓存解析失败，继续获取新数据
                }
            }
        }

        setState(prev => ({...prev, loading: true}));

        try {
            const data = await batchAptosViewFetch<T>(currentRequests, client.current);
            setState({loading: false, data: data || []});

            if (cacheKeyStr && data) {
                try {
                    sessionStorage.setItem(cacheKeyStr, JSON.stringify(data));
                } catch {
                    // 缓存存储失败，不影响主流程
                }
            }
        } catch (error) {
            setState({loading: false, error: error as Error});
        }
    }, [cacheKeyStr, ...deps]);

    useEffect(() => {
        if (!skipInitialFetch && initialRef.current) {
            initialRef.current = false;
            fetchData();
        }
    }, [skipInitialFetch, fetchData]);

    useEffect(() => {
        if (!initialRef.current && !skipInitialFetch) {
            fetchData();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(requests)]);

    return [state.data, fetchData, state];
}

/**
 * 自动刷新获取Aptos合约数据的Hook
 */
export function useAutoFetch<T>(
    fetchFn: () => Promise<T>,
    interval?: number
): [T | undefined, () => Promise<void>, AutoFetchState<T>] {
    const [state, setState] = useState<AutoFetchState<T>>({loading: false});
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const fetchFnRef = useRef(fetchFn);

    useEffect(() => {
        fetchFnRef.current = fetchFn;
    }, [fetchFn]);

    const fetchData = useCallback(async (): Promise<void> => {
        setState(prev => ({...prev, loading: true}));

        try {
            const data = await fetchFnRef.current();
            setState({loading: false, data});
        } catch (error) {
            setState({loading: false, error: error as Error});
        }
    }, []);

    const clearInterval = useCallback(() => {
        if (intervalRef.current) {
            global.clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    useEffect(() => {
        fetchData();

        if (interval && interval > 0) {
            intervalRef.current = global.setInterval(fetchData, interval);
        }

        return clearInterval;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return [state.data, fetchData, state];
}
