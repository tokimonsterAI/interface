import {Application, Request, Response, NextFunction} from 'express';
import {createProxyMiddleware, Filter, Options} from 'http-proxy-middleware';

import {increaseViolationCount} from '../util/access-control';
import {createRefreshQueue} from '../util/refresh-queue';
import {sendMessage} from '../util/tele-bot';

const whitelistedVendorHosts = [
    'dex-website-beta.vercel.app',
];

const getVendorHost = (req: Request) => {
    // /vendor-proxy/{host}/{api_path}
    const vendorHost = req.originalUrl.split('/')[2];

    return `https://${vendorHost}`;
};

const getVendorPath = (req: Request) => {
    // without leading slash works
    return req.originalUrl.split('/').slice(3).join('/');
};

const filter: Filter = (pathname, req) => {
    const vendorHostURL = new URL(getVendorHost(req));
    const vendorHost = vendorHostURL.hostname;

    // domain or subdomain
    const isWhitelisted = whitelistedVendorHosts.includes(vendorHost)
        || whitelistedVendorHosts.some(host => vendorHost.endsWith(`.${host}`));

    if (!isWhitelisted) {
        increaseViolationCount(req.ip);
        sendMessage(`[Vendor Proxy] ${req.ip} is trying access ${req.originalUrl}`, {
            channel: 'alert',
            group: 'Vendor Proxy'
        });
    }

    return isWhitelisted;
};

const options: Options = {
    changeOrigin: true,
    logProvider: () => console,
    router: req => getVendorHost(req),
    pathRewrite: (pathname, req) => getVendorPath(req),
    onError: (err, req, res) => {
        console.error('[Vendor proxy] error', err);

        res.status(500).send('An error occurred while processing your request.');

        sendMessage(`[Vendor Proxy] ${req.ip} proxy error occurred, ${err.message}, ${req.originalUrl}`, {
            channel: 'alert',
            group: 'Vendor Proxy'
        });
    }
};

type CachedProxyOptions = {
    host: string
    logTag: string
    fileCachePath: string
    refreshDuration?: number
    refreshInterval?: number
    refreshMaxWaitTime?: number
};

const createCachedProxy = ({
    host,
    logTag,
    fileCachePath,
    refreshDuration = 600e3, // 10 minutes
    refreshInterval = 2e3,
    refreshMaxWaitTime = 120e3 // 2 minutes
}: CachedProxyOptions) => {
    const queue = createRefreshQueue({
        fetch: async (url: string) => {
            const response = await fetch(url);
            if (response.status !== 200) {
                console.error(`${logTag} error status`, {url, status: response.status});
                throw new Error(`status: ${response.status}`);
            }

            const data = await response.json();
            if (data.error) {
                console.error(`${logTag} error data`, {url, data});
                throw new Error(data.error);
            }

            return data;
        },

        fileCachePath,
        getCacheKey: (targetUrl: string) => targetUrl,

        refreshDuration,
        refreshInterval,
        refreshMaxWaitTime, // 10 minutes

        logTag
    });

    return {
        ...queue,

        middleware: () => (req: Request, res: Response, next: NextFunction) => {
            const venderHost = getVendorHost(req);
            if (req.method !== 'GET' || !venderHost.endsWith(host)) {
                next();

                return;
            }

            const targetUrl = `${venderHost}/${getVendorPath(req)}`;
            console.log(`[VendorProxy]${logTag} getCacheOrFetchData`, targetUrl);

            queue.getCacheOrFetchData(targetUrl)
                .then(data => res.json(data))
                .catch(err => {
                    console.error(`[VenderProxy]${logTag} error`, err);

                    sendMessage(`VenderProxy]${logTag} error occurred, ${err.message}, ${req.originalUrl}`, {
                        channel: 'alert',
                        group: 'Vendor Proxy'
                    });

                    // fallback to next
                    next();
                });
        }
    };
};

type VendorProxyOptions = {
    cachedProxies?: CachedProxyOptions[]
};

export function mountVendorProxy(app: Application, {cachedProxies}: VendorProxyOptions = {}) {
    const proxies = cachedProxies?.map(createCachedProxy) ?? [];

    app.use('/vendor-proxy', ...(proxies.map(proxy => proxy.middleware())), createProxyMiddleware(filter, options));

    app.get('/api/restricted/vendor-proxy/status', (req, res) => res.json(proxies.map((proxy, idx) => ({
        host: cachedProxies?.[idx].host,
        status: proxy.getQueueStatus()
    }))));
}
