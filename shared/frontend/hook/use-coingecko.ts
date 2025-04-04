import {useCallback} from 'react';

import {TOKEN_ID_TYPE, getSimplePrice} from '../util/coingecko';

import {useAutoFetch} from './use-fetch';

export const useCoingeckoSimplePrice = (tokenId: TOKEN_ID_TYPE, currency?: string) => {
    return useAutoFetch<number | undefined>(useCallback(() => getSimplePrice(tokenId, currency), [tokenId, currency]));
};
