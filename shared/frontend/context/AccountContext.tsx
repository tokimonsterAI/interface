import {Web3Provider} from '@ethersproject/providers';
import {createWeb3Name} from '@web3-name-sdk/core';
import {useWallets} from '@web3-onboard/react';
import {providers} from 'ethers';
import {createContext, useCallback, useContext, useMemo, useState} from 'react';

import {useAutoFetch} from '../hook/use-fetch';
import {getOverrideAccountFromStorage, saveOverrideAccountToStorage, getMonetaryUnitFromStorage, setMonetaryUnitFromStorage, MonetaryUnitEnum} from '../util/local-storage';

export type AccountContextType = {
    account?: string
    active?: boolean

    // Space ID
    domainName?: string | null

    monetaryUnit?: MonetaryUnitEnum
    switchMonetaryUnit?: () => void

    chainId?: number
    library?: providers.Web3Provider
    signer?: providers.JsonRpcSigner

    overrideAccount?: string | undefined
    setOverrideAccount?: (account?: string) => void
}

export const initialAccountContext: AccountContextType = {};

export const AccountContext = createContext<AccountContextType>(initialAccountContext);

export const useAccountContext = () => useContext(AccountContext);

const getLibrary = (provider: any, chainId?: number) => {
    const library = new Web3Provider(provider, chainId);

    library.pollingInterval = 12e3;

    return library;
};

// ref: https://docs.space.id/developer-guide/web3-name-sdk
const web3Name = createWeb3Name();

export const useAccountContextProvider = (): AccountContextType => {
    const wallets = useWallets();
    const wallet = wallets?.[0] || {};

    const {accounts, chains, provider} = wallet;
    const actualAccount = accounts?.[0]?.address;
    const chainId = Number(chains?.[0]?.id);
    const active = !!actualAccount;

    const library = useMemo(() => provider && getLibrary(provider, chainId), [provider, chainId]);
    const signer = useMemo(() => library && library.getSigner(actualAccount), [actualAccount, library]);

    // for become account
    const [overrideAccount, setOverrideAccountState] = useState<string | undefined>(getOverrideAccountFromStorage);
    const setOverrideAccount = useCallback((_account?: string) => {
        const newOverrideAccount = _account?.trim() || undefined;
        setOverrideAccountState(newOverrideAccount);
        saveOverrideAccountToStorage(newOverrideAccount);
    }, []);

    const account = overrideAccount ?? actualAccount;

    const [domainName] = useAutoFetch(useCallback(() => {
        if (!account) {
            return Promise.reject();
        }

        return web3Name.getDomainName({address: account});
    }, [account]), {
        cachePool: 'web3-name',
        cacheKey: account
    });

    const [domainNameOnCurrentChain] = useAutoFetch(useCallback(() => {
        if (!account) {
            return Promise.reject();
        }

        return web3Name.getDomainName({address: account, queryChainIdList: [chainId]});
    }, [account, chainId]), {
        cachePool: 'web3-name-with-chain',
        cacheKey: `${account}-${chainId}`
    });

    //switch USD ETH
    const [monetaryUnit, setMonetaryUnit] = useState<MonetaryUnitEnum>(getMonetaryUnitFromStorage() ?? MonetaryUnitEnum.USD);
    const switchMonetaryUnit = useCallback(() => {
        setMonetaryUnit(pre => {
            const newMonetaryUnit = pre === MonetaryUnitEnum.USD ? MonetaryUnitEnum.ETH : MonetaryUnitEnum.USD;
            setMonetaryUnitFromStorage(newMonetaryUnit);

            return newMonetaryUnit;
        });
    }, []);

    return useMemo(() => ({
        account,
        active,

        domainName: domainNameOnCurrentChain ?? domainName,

        monetaryUnit,
        switchMonetaryUnit,

        chainId,
        library,
        signer,

        overrideAccount,
        setOverrideAccount
    }), [account, active, domainNameOnCurrentChain, domainName, monetaryUnit, switchMonetaryUnit, chainId, library, signer, overrideAccount, setOverrideAccount]);
};

export const AccountContextProvider = ({children}: { children: React.ReactNode }) => {
    const value = useAccountContextProvider();

    return (
        <AccountContext.Provider value={value}>
            {children}
        </AccountContext.Provider>
    );
};
