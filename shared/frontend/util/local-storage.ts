import {getCacheValue, saveCacheValue} from './local-cache';

const getLocalStorageState = <T>(key: string, defaultString = '{}') => {
    const state = JSON.parse(localStorage.getItem(key) || defaultString);

    return state as T;
};

const saveLocalStorageState = <T>(key: string, state: T) => {
    localStorage.setItem(key, JSON.stringify(state));
};

// Anti-phishing tip
const ANTI_PHISHING_TIP = '__anti_phishing_tip';
type AntiPhishingTipState = string;

export const getAntiPhishingTipState = () => {
    return getLocalStorageState<AntiPhishingTipState>(ANTI_PHISHING_TIP);
};

export const saveAntiPhishingTipState = (state: AntiPhishingTipState) => {
    saveLocalStorageState<AntiPhishingTipState>(ANTI_PHISHING_TIP, state);
};

// release version
const RELEASE_VERSION = '__release_version';
type ReleaseVersionState = string;

export const getVersionUpdateState = () => {
    return getLocalStorageState<ReleaseVersionState>(RELEASE_VERSION);
};

export const saveVersionUpdateState = (state: ReleaseVersionState) => {
    saveLocalStorageState<ReleaseVersionState>(RELEASE_VERSION, state);
};
// for wallet

const WALLET_CONNECTION_KEY = '__wallet_connection';

type WalletConnectionState = {
    name?: string
    autoConnect?: boolean
}

export const getWalletConnectionState = () => {
    return getLocalStorageState<WalletConnectionState>(WALLET_CONNECTION_KEY);
};

export const saveWalletConnectionState = (state: WalletConnectionState) => {
    saveLocalStorageState<WalletConnectionState>(WALLET_CONNECTION_KEY, state);
};

const ONBOARD_CONNECTED_WALLET_KEY = 'onboard.js:last_connected_wallet';

export const getWeb3OnboardConnectedWallets = () => {
    return getLocalStorageState<string[]>(ONBOARD_CONNECTED_WALLET_KEY, '[]');
};

export const overrideWeb3OnboardConnectedWallets = (walletNames: string[]) => {
    return saveLocalStorageState(ONBOARD_CONNECTED_WALLET_KEY, walletNames);
};

const PREFERENCE_CACHE_POOL = '__preference';

export const getPreferredChainIdFromStorage = () => {
    return getCacheValue<number>(PREFERENCE_CACHE_POOL, 'preferredChainId');
};

export const savePreferredChainIdToStorage = (chainId: number) => {
    saveCacheValue(PREFERENCE_CACHE_POOL, 'preferredChainId', chainId);
};

const OVERRIDE_CACHE_POOL = '__override';

export const getOverrideAccountFromStorage = () => {
    return getCacheValue<string>(OVERRIDE_CACHE_POOL, 'account');
};

export const saveOverrideAccountToStorage = (account?: string) => {
    saveCacheValue(OVERRIDE_CACHE_POOL, 'account', account);
};

export enum MonetaryUnitEnum {
    ETH = 'ETH',
    USD = 'USD'
}

export const getMonetaryUnitFromStorage = () => {
    return getCacheValue<MonetaryUnitEnum>(PREFERENCE_CACHE_POOL, 'monetaryUnit');
};

export const setMonetaryUnitFromStorage = (state: MonetaryUnitEnum) => {
    saveCacheValue(PREFERENCE_CACHE_POOL, 'monetaryUnit', state);
};
