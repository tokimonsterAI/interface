import {useCallback, useMemo} from 'react';

import {useAutoFetch, AutoFetchState} from '@shared/fe/hook/use-fetch';
import {fetchJson} from '@shared/fe/util/fetch';

import User from 'src/assets/default-user.png';
import {TokenCatalogType} from 'src/pages/home/components/token-catalog';
import {baseApiUrl} from 'src/utils/env';

// const getReleaseTime = (blockNumber: number) => {
//     const benchmarkBlockNumber = 45783093;
//     const benchmarkTime = 1736930657000;
//     const blockTime = 3000;
//     const time = benchmarkTime + (blockNumber - benchmarkBlockNumber) * blockTime;

//     return time;
// };

export const useFetchTokens = (): [TokenCatalogType[], AutoFetchState] => {
    const [filterEvents = [],, tokenListState] = useAutoFetch<any>(
        useCallback(() => fetchJson(`${baseApiUrl}/api/tokimonster/deploy-token`)
            .then((data: any) => {
                if (!data || !Object.keys(data).length) {
                    throw new Error('empty response');
                }

                return data?.list || [];
            }), [])
    );

    const tokens: TokenCatalogType[] = useMemo(() => {
        const arr = filterEvents?.map((event: any) => {
            const cast_hash = event?.data?.cast_hash;
            const twitterInfo = cast_hash?.startsWith('{') ? JSON.parse(cast_hash) : null;

            return {
                tokenPic: event?.data?.image,
                tokenName: event?.data?.name,
                symbol: event?.data?.symbol,
                releaseTime: Math.floor(event.block_timestamp / 1000),
                twitterAvatar: User,
                twitterName: twitterInfo?.twitter?.username,
                twitterId: twitterInfo?.twitter?.id,
                address: event?.data?.token?.inner
            };
        })?.sort((a: { releaseTime: number }, b: { releaseTime: number }) => b.releaseTime - a.releaseTime);

        return arr;
    }, [filterEvents]);

    return [tokens, tokenListState];
};
