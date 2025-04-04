import {isInNode, isInBrowser, isHostnameMatched} from '@shared/fe/util/env';

export {
    isInNode,
    isInBrowser
};

export const isNextEnv = (hostname?: string) => isHostnameMatched(['nextnet.tokimonster.io', '127.0.0.1'], hostname);

export const isTestEnv = (hostname?: string) => isHostnameMatched(['testnet.tokimonster.io'], hostname);

export const isDevEnv = (hostname?: string) => isHostnameMatched(['localhost'], hostname);

export const isTestOrDevEnv = (hostname?: string) => isTestEnv(hostname) || isDevEnv(hostname);

// All other hostname are considered as production environment (will apply most restrictions)
export const isProdEnv = (hostname?: string) => !isNextEnv(hostname) && !isTestEnv(hostname) && !isDevEnv(hostname);

export const isLocalHost = (hostname?: string) => isHostnameMatched(['localhost', '127.0.0.1'], hostname);

// node api proxy base url
export const baseApiUrl = ((): string => {
    if (!isLocalHost()) {
        return '';
    }

    // proxy to test/next in DEV env cuz of the GFW
    if (isNextEnv()) {
        return '/vendor-proxy/nextnet.tokimonster.io';
    }

    return '/vendor-proxy/testnet.tokimonster.io';
})();

