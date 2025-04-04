import {fetchJson} from 'ethers/lib/utils';
import {useCallback, useMemo} from 'react';

import {AutoFetchState, useAutoFetch} from '@shared/fe/hook/use-fetch';

import {baseApiUrl} from 'src/utils/env';

import {useAccountContext} from '../GlobalContext';

type DbUser = {
    walletAddress: string
    twitter?: {
        userId: string
        username: string
    }
}

export type DbUserContextType = {
    user?: DbUser
    fetchingState?: AutoFetchState
    refresh?: () => void
    connectX?: () => void
}

export const initialDbUserContext: DbUserContextType = {};

const fetchDbUser = async (walletAddress: string) => fetchJson(`${baseApiUrl}/api/tokimonster/user?walletAddress=${walletAddress}`);

const createDbUser = async (walletAddress: string, message: string, signature: string) => {
    const response = await fetch(`${baseApiUrl}/api/tokimonster/user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            walletAddress,
            message,
            signature
        })
    });

    if (!response.ok) {
        throw new Error(`Failed to create tokimonster user: ${await response.text()}`);
    }

    return response.json();
};

export function useDbUserContextProvider(): DbUserContextType {
    const {account, signer} = useAccountContext();

    const [data, refresh, fetchingState] = useAutoFetch(useCallback(() => {
        if (!account) {
            return Promise.reject();
        }

        return fetchDbUser(account);
    }, [account]), {
        autoFetchClearState: true,
        refreshOnVisible: true
    });

    const connectX = useCallback(async () => {
        if (!account || !signer) {
            return Promise.reject();
        }

        const message = JSON.stringify({
            info: 'Connect X to Tokimonster',
            expiredAt: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes
        }, null, 2);

        const signature = await signer.signMessage(message);

        if (!data?.userInfo) {
            await createDbUser(account, message, signature);
        }

        window.open(`${baseApiUrl}/api/tokimonster/twitter/oauth?action=follow&walletAddress=${account}&message=${encodeURIComponent(message)}&signature=${signature}`, '_blank');
    }, [account, data?.userInfo, signer]);

    return useMemo(() => ({
        user: data?.userInfo,
        fetchingState,
        refresh,
        connectX
    }), [
        data,
        fetchingState,
        refresh,
        connectX
    ]);
}
