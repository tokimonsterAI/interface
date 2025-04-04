import {loadFileCache, writeFileCache} from './file-cache';
import {sendProjectMsg} from './tele-bot';

const DEBUG = !!process.env.DEBUG;

type CacheItem<T> = {
    data: T
    updatedAt: Date
}

type Options<Request, Response> = {
    fetch: (req: Request) => Promise<Response>

    fileCachePath?: string
    getCacheKey: (req: Request) => string
    enableBigNumberParsing?: boolean

    refreshDuration: number // cache expires after this time
    refreshInterval: number // refresh interval, must be < 1min / requests per min
    refreshMaxWaitTime: number // cool down time

    logTag: string
}

export const createRefreshQueue = <Request, Response> (options: Options<Request, Response>) => {
    const {
        fetch,

        fileCachePath,
        getCacheKey,
        enableBigNumberParsing,

        refreshDuration,
        refreshInterval,
        refreshMaxWaitTime,

        logTag
    } = options;

    const sendAlertMessage = (msg: string, err?: any) =>
        sendProjectMsg('RefreshQueue', `${logTag} ${msg}${err?.message ? `\n${err.message}` : ''}`, undefined, {
            channel: 'alert',
            group: 'Refresh Queue'
        });

    const loadCache = () => loadFileCache(fileCachePath, {enableBigNumberParsing});
    const writeCache = (cache: any) => writeFileCache(fileCachePath, cache);

    const cache: Record<string, CacheItem<Response>> = loadCache() ?? {};
    const promiseCache: Record<string, Promise<Response>> = {};

    const refreshQueue: Request[] = [];
    let refreshTimerId: NodeJS.Timeout | undefined;
    let nextQueueRefreshTime = Date.now(); // refresh available only after this time

    const forceRefreshCacheData = async (req: Request): Promise<Response> => {
        const cacheKey = getCacheKey(req);
        let cachedPromise = promiseCache[cacheKey];

        if (!cachedPromise) {
            // delay next queue refresh
            nextQueueRefreshTime = Math.min(
                Math.max(nextQueueRefreshTime, Date.now()) + refreshInterval,
                Date.now() + refreshMaxWaitTime
            );

            if (DEBUG) {
                console.log(logTag, 'refreshing started:', cacheKey);
            }

            cachedPromise = fetch(req)
                .then(response => {
                    if (DEBUG) {
                        console.log(logTag, 'refreshing succeeded:', cacheKey);
                    }

                    cache[cacheKey] = {
                        data: response,
                        updatedAt: new Date()
                    };

                    return response;
                })
                .catch(error => {
                    console.error(logTag, 'refreshing failed:', cacheKey);
                    console.error(error);

                    return Promise.reject(error);
                })
                .finally(() => {
                    delete promiseCache[cacheKey];
                });

            promiseCache[cacheKey] = cachedPromise;
        }

        return cachedPromise;
    };

    const triggerRefreshQueue = (): void => {
        if (refreshTimerId) {
            return;
        }

        console.log(logTag, 'refresh queue started, queue size:', refreshQueue.length);

        refreshTimerId = setInterval(() => {
            if (nextQueueRefreshTime - Date.now() > 100) { // ms
                console.log(logTag, `wait for nextQueueRefreshTime: ${(nextQueueRefreshTime - Date.now()) / 1e3}s`);

                return;
            }

            if (DEBUG) {
                console.log(logTag, 'refresh queue size:', refreshQueue.length);
            }

            const req = refreshQueue.shift();
            if (!req) {
                console.log(logTag, 'refresh queue finished.');

                writeCache(cache);

                clearInterval(refreshTimerId);
                refreshTimerId = undefined;

                return;
            }

            forceRefreshCacheData(req)
                .catch(error => {
                    const status = error?.code || error?.status || error?.response?.status;
                    const msg = `auto refresh failed: status=${status}}`;
                    console.error(msg);
                    console.error(error);
                    sendAlertMessage(msg, error);
                });
        }, refreshInterval);
    };

    const enqueueRefresh = (req: Request): void => {
        if (refreshQueue.some(item => getCacheKey(req) === getCacheKey(item))) {
            return;
        }

        refreshQueue.push(req);

        triggerRefreshQueue();
    };

    const getRawCache = (req: Request) => cache[getCacheKey(req)];

    const isCacheItemExpired = <T> (cacheItem?: CacheItem<T>) => {
        if (!cacheItem) {
            return true; // no cache, regard as expired
        }

        return cacheItem && new Date(cacheItem.updatedAt).getTime() + refreshDuration < Date.now();
    };

    const getCacheData = (req: Request): Response | undefined => {
        const cachedResponse = getRawCache(req);
        if (isCacheItemExpired(cachedResponse)) {
            enqueueRefresh(req);
        }

        return cachedResponse?.data;
    };

    const getCacheOrFetchData = (req: Request): Promise<Response> => {
        const cachedData = getCacheData(req);
        if (!cachedData) {
            return forceRefreshCacheData(req);
        }

        return Promise.resolve(cachedData);
    };

    // batch operations
    const batchGetCacheData = (requests: Request[]): (Response | undefined)[] => {
        return requests.map(req => getCacheData(req));
    };

    const batchForceRefreshCacheData = (requests: Request[]): Promise<Response[]> => {
        return Promise.all(requests.map(req => forceRefreshCacheData(req)));
    };

    const batchGetCacheOrFetchData = (requests: Request[]): Promise<Response[]> => {
        return Promise.all(requests.map(req => getCacheOrFetchData(req)));
    };

    const getQueueStatus = () => ({
        cacheSize: Object.keys(cache).length,
        promiseCacheSize: Object.keys(promiseCache).length,
        nextQueueRefreshTime: new Date(nextQueueRefreshTime).toISOString(),
        refreshing: !!refreshTimerId,
        refreshQueueLength: refreshQueue.length,
        refreshQueue
    });

    return {
        getRawCache,
        getCacheData,
        forceRefreshCacheData,
        getCacheOrFetchData, // this is the most useful method

        batchGetCacheData,
        batchForceRefreshCacheData,
        batchGetCacheOrFetchData,

        getQueueStatus
    };
};
