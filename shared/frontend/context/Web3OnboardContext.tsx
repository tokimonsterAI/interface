import {WalletModule, WalletInit} from '@web3-onboard/common';
import {InitOptions, OnboardAPI} from '@web3-onboard/core';
import injectedModule, {ProviderLabel} from '@web3-onboard/injected-wallets';
import {InjectedWalletModule, InjectedNameSpace, InjectedWalletOptions} from '@web3-onboard/injected-wallets/dist/types';
import officialInjectedWallets from '@web3-onboard/injected-wallets/dist/wallets';
import {init, Web3OnboardProvider} from '@web3-onboard/react';
import walletConnectModule from '@web3-onboard/walletconnect';
import {useEffect, useState} from 'react';
import {Flex, Spinner} from 'theme-ui';

import {getWeb3OnboardConnectedWallets, getWalletConnectionState} from '@shared/fe/util/local-storage';
import {isMobile} from '@shared/fe/util/ua';
import {isRabby} from '@shared/fe/util/wallets';

export const CustomizedProviderLabel = {
    CactusLink: 'Cactus Link',
    GateWallet: 'GateWallet'
};

// Ref: https://onboard.blocknative.com/docs/wallets/injected#adding-custom-injected-wallets
const cactusLink: InjectedWalletModule = {
    label: CustomizedProviderLabel.CactusLink,
    injectedNamespace: InjectedNameSpace.Ethereum,
    checkProviderIdentity: ({provider}) => !!provider && !!provider.isCactusWallet,
    getIcon: async () => (await import('@shared/fe/asset/wallet/cactus-link.png')).default,
    getInterface: async () => ({
        provider: (window as any).ethereum
    }),
    platforms: ['desktop'],
    externalUrl: 'https://chromewebstore.google.com/detail/cactus-link/chiilpgkfmcopocdffapngjcbggdehmj'
};

const gateWallet: InjectedWalletModule = {
    label: CustomizedProviderLabel.GateWallet,
    injectedNamespace: InjectedNameSpace.Ethereum,
    checkProviderIdentity: ({provider}) => !!provider && !!(window as any).gatewallet?.isGateWallet,
    getIcon: async () => 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDE5MiAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMF8xMzk3XzM3NjQpIj4KPHJlY3Qgd2lkdGg9IjE5MiIgaGVpZ2h0PSIxOTIiIHJ4PSI4IiBmaWxsPSJ3aGl0ZSIvPgo8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDFfMTM5N18zNzY0KSI+CjxyZWN0IHk9IjE1NC4zNjciIHdpZHRoPSIxOTIiIGhlaWdodD0iMzcuNjMyIiBmaWxsPSIjMDI1NUVCIi8+CjxwYXRoIGQ9Ik05Ni4wMDAyIDEwNS44OEM4OC4yOTQxIDEwNS44OCA4MC45MDM3IDEwMi44MiA3NS40NTQ3IDk3LjM3MjJDNzAuMDA1NyA5MS45MjQ4IDY2Ljk0NDUgODQuNTM2NSA2Ni45NDQ1IDc2LjgzMjdDNjYuOTQ0NSA2OS4xMjg5IDcwLjAwNTcgNjEuNzQwNiA3NS40NTQ3IDU2LjI5MzFDODAuOTAzNyA1MC44NDU3IDg4LjI5NDEgNDcuNzg1NCA5Ni4wMDAyIDQ3Ljc4NTRWMjQuMDA1NEM4NS41NTE0IDI0LjAwNTQgNzUuMzM3MiAyNy4xMDI5IDY2LjY0OTMgMzIuOTA2M0M1Ny45NjE0IDM4LjcwOTcgNTEuMTkgNDYuOTU4MiA0Ny4xOTE0IDU2LjYwODlDNDMuMTkyOCA2Ni4yNTk2IDQyLjE0NjYgNzYuODc4OSA0NC4xODUxIDg3LjEyNEM0Ni4yMjM1IDk3LjM2OTEgNTEuMjU1MSAxMDYuNzggNTguNjQzNiAxMTQuMTY2QzY2LjAzMiAxMjEuNTUyIDc1LjQ0NTQgMTI2LjU4MyA4NS42OTM1IDEyOC42MkM5NS45NDE2IDEzMC42NTggMTA2LjU2NCAxMjkuNjEyIDExNi4yMTcgMTI1LjYxNUMxMjUuODcxIDEyMS42MTggMTM0LjEyMiAxMTQuODQ4IDEzOS45MjcgMTA2LjE2M0MxNDUuNzMyIDk3LjQ3NzQgMTQ4LjgzIDg3LjI2NjIgMTQ4LjgzIDc2LjgyMDNIMTI1LjAzMUMxMjUuMDM2IDgwLjYzNDggMTI0LjI4OSA4NC40MTI3IDEyMi44MzIgODcuOTM4MkMxMjEuMzc1IDkxLjQ2MzYgMTE5LjIzOCA5NC42Njc1IDExNi41NDEgOTcuMzY2NEMxMTMuODQ1IDEwMC4wNjUgMTEwLjY0MyAxMDIuMjA2IDEwNy4xMTggMTAzLjY2N0MxMDMuNTk0IDEwNS4xMjggOTkuODE1NyAxMDUuODggOTYuMDAwMiAxMDUuODhaIiBmaWxsPSIjMDI1NUVCIi8+CjxwYXRoIGQ9Ik0xMjUuMDU2IDQ3Ljc3MUg5NlY3Ni44MTgzSDEyNS4wNTZWNDcuNzcxWiIgZmlsbD0iIzAwRTY5NyIvPgo8cGF0aCBkPSJNMTkxLjk3NSAxNDkuOTk1QzE2My4xNyAxNDMuMDg1IDEzMC41NzMgMTM5LjE4MiA5NS45ODc3IDEzOS4xODJDNjEuNDAyIDEzOS4xODIgMjguODA0OSAxNDMuMDg1IDAgMTQ5Ljk5NVYxNTQuMzE3QzAgMTY0LjMwNyAzLjk2OTE2IDE3My44ODggMTEuMDM0NCAxODAuOTUyQzE4LjA5OTUgMTg4LjAxNiAyNy42ODIgMTkxLjk4NSAzNy42NzM3IDE5MS45ODVIMTU0LjMyNkMxNjQuMzE4IDE5MS45ODUgMTczLjkgMTg4LjAxNiAxODAuOTY2IDE4MC45NTJDMTg4LjAzMSAxNzMuODg4IDE5MiAxNjQuMzA3IDE5MiAxNTQuMzE3TDE5MS45NzUgMTQ5Ljk5NVoiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl8xMzk3XzM3NjQpIi8+CjxwYXRoIGQ9Ik0xOTEuOTc1IDE1NC4zMzhDMTYzLjM4NyAxNDcuMTI1IDEzMC43MDkgMTQzLjAzMSA5NS45ODc3IDE0My4wMzFDNjEuMjY2MSAxNDMuMDMxIDI4LjU4ODggMTQ3LjEyNSAwIDE1NC4zMzhDMCAxNjQuMzI4IDMuOTY5MTYgMTczLjkwOSAxMS4wMzQ0IDE4MC45NzNDMTguMDk5NSAxODguMDM3IDI3LjY4MiAxOTIuMDA1IDM3LjY3MzcgMTkyLjAwNUgxNTQuMzI2QzE2NC4zMTggMTkyLjAwNSAxNzMuOSAxODguMDM3IDE4MC45NjYgMTgwLjk3M0MxODguMDMxIDE3My45MDkgMTkyIDE2NC4zMjggMTkyIDE1NC4zMzhIMTkxLjk3NVoiIGZpbGw9IiMwMjU1RUIiLz4KPHBhdGggZD0iTTc1LjI3MDYgMTc2LjgxNkg3MC4xOTk0TDY2LjI0NjMgMTU5LjI0Mkw2Mi4yMTI4IDE3Ni44MTZINTcuMTQxNkw1Mi42NzU4IDE1Ni42NDhINTYuMTU5NUw1OS43MzU5IDE3My41OTNMNjMuNzM4NSAxNTYuNjQ4SDY4Ljc4NDlMNzIuNjc2MyAxNzMuNTMxTDc2LjIzNDEgMTU2LjY0OEg3OS43Nzk2TDc1LjI3MDYgMTc2LjgxNloiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik05Ni4wNzQzIDE2MS41MjFWMTc2Ljc5Mkg5Mi43NjM1VjE3NC43NDJDOTIuMTQ0NyAxNzUuNDU1IDkxLjM4MjkgMTc2LjAyOSA5MC41Mjc1IDE3Ni40MjhDODkuNjQ4OSAxNzYuODQyIDg4LjY4ODMgMTc3LjA1MyA4Ny43MTcgMTc3LjA0NUM4Ni4zODM1IDE3Ny4wNTIgODUuMDc1MiAxNzYuNjgyIDgzLjk0MyAxNzUuOTc3QzgyLjE5MTEgMTc0Ljg3NyA4MC45Mjc3IDE3My4xNDcgODAuNDEzIDE3MS4xNDRDNzkuODk4MiAxNjkuMTQgODAuMTcxMiAxNjcuMDE2IDgxLjE3NTggMTY1LjIwOEM4MS44MjYgMTY0LjAyOSA4Mi43NzM3IDE2My4wNDEgODMuOTI0NSAxNjIuMzQzQzg1LjA1OSAxNjEuNjQ1IDg2LjM2NjUgMTYxLjI3OSA4Ny42OTg1IDE2MS4yODdDODguNjY5OCAxNjEuMjc5IDg5LjYzMDMgMTYxLjQ5IDkwLjUwODkgMTYxLjkwNEM5MS4zNTg5IDE2Mi4yOTggOTIuMTE5NyAxNjIuODYyIDkyLjc0NDkgMTYzLjU1OVYxNjEuNTE1TDk2LjA3NDMgMTYxLjUyMVpNOTAuNTE1MSAxNzMuMzc4QzkxLjI0MyAxNzIuOTUzIDkxLjg0NzcgMTcyLjM0NyA5Mi4yNjk0IDE3MS42MThDOTIuNjg3IDE3MC44ODcgOTIuOTAwMyAxNzAuMDU3IDkyLjg4NyAxNjkuMjE2QzkyLjg5NDQgMTY4LjU3NiA5Mi43NzQ0IDE2Ny45NDIgOTIuNTM0IDE2Ny4zNUM5Mi4yOTM3IDE2Ni43NTcgOTEuOTM3OCAxNjYuMjE4IDkxLjQ4NyAxNjUuNzY1QzkxLjAzNjMgMTY1LjMxMSA5MC40OTk3IDE2NC45NTIgODkuOTA4NyAxNjQuNzA4Qzg5LjMxNzYgMTY0LjQ2NCA4OC42ODM5IDE2NC4zNCA4OC4wNDQ0IDE2NC4zNDNDODcuMTk5NSAxNjQuMzM4IDg2LjM2ODkgMTY0LjU2MiA4NS42NDE2IDE2NC45OTJDODQuOTA4MyAxNjUuNDE1IDg0LjI5NzUgMTY2LjAyMiA4My44Njg5IDE2Ni43NTJDODMuNDI2OCAxNjcuNDg2IDgzLjE5OCAxNjguMzI4IDgzLjIwNzkgMTY5LjE4NUM4My4yMDYgMTcwLjAzMyA4My40MjcgMTcwLjg2NiA4My44NDg3IDE3MS42MDJDODQuMjcwMyAxNzIuMzM4IDg0Ljg3OCAxNzIuOTUgODUuNjEwNyAxNzMuMzc4Qzg2LjM1MjYgMTczLjgwMiA4Ny4xOTI2IDE3NC4wMjYgODguMDQ3NSAxNzQuMDI2Qzg4LjkwMjMgMTc0LjAyNiA4OS43NDI0IDE3My44MDIgOTAuNDg0MiAxNzMuMzc4SDkwLjUxNTFaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNOTkuMjc0OSAxNzYuODE2VjE1Ni42NDhIMTAyLjU5MlYxNzYuODE2SDk5LjI3NDlaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTA1Ljc2IDE3Ni44MTZWMTU2LjY0OEgxMDkuMDc3VjE3Ni44MTZIMTA1Ljc2WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTEyMy41NjcgMTYyLjM0MUMxMjQuNzYyIDE2My4wMjggMTI1Ljc1NCAxNjQuMDE3IDEyNi40NDIgMTY1LjIxQzEyNy4xMzEgMTY2LjQwMyAxMjcuNDkyIDE2Ny43NTcgMTI3LjQ5IDE2OS4xMzRDMTI3LjQ4NiAxNjkuNTQ3IDEyNy40NTcgMTY5Ljk1OSAxMjcuNDAzIDE3MC4zNjlIMTE1LjAxM0MxMTUuMTM3IDE3MS4wNjIgMTE1LjQxMSAxNzEuNzE5IDExNS44MTYgMTcyLjI5NUMxMTYuMjY2IDE3Mi44NzkgMTE2Ljg1MSAxNzMuMzQ1IDExNy41MiAxNzMuNjU0QzExOC4xODQgMTczLjkzOCAxMTguODk4IDE3NC4wODUgMTE5LjYyIDE3NC4wODZDMTIwLjQ3NyAxNzQuMDgyIDEyMS4zMjIgMTczLjg4NCAxMjIuMDkxIDE3My41MDZDMTIyLjc4MSAxNzMuMTk4IDEyMy4zOTggMTcyLjc0OCAxMjMuOTAxIDE3Mi4xODRMMTI2LjgxNiAxNzIuOTg3QzEyNi4xNyAxNzQuMjI5IDEyNS4xNSAxNzUuMjM3IDEyMy45MDEgMTc1Ljg3MUMxMjIuNTg0IDE3Ni42MjQgMTIxLjA5NCAxNzcuMDIyIDExOS41NzcgMTc3LjAyNUMxMTguMTg5IDE3Ny4wMzMgMTE2LjgyNSAxNzYuNjY0IDExNS42MyAxNzUuOTU3QzExNC40MzcgMTc1LjI2MiAxMTMuNDQ1IDE3NC4yNjggMTEyLjc1MiAxNzMuMDczQzExMi4wNTIgMTcxLjg3NiAxMTEuNjg0IDE3MC41MTQgMTExLjY4NCAxNjkuMTI4QzExMS42ODQgMTY3Ljc0MSAxMTIuMDUyIDE2Ni4zNzkgMTEyLjc1MiAxNjUuMTgyQzExMy40NDIgMTYzLjk5IDExNC40MzUgMTYzLjAwMSAxMTUuNjMgMTYyLjMxN0MxMTYuODMgMTYxLjYyNSAxMTguMTkyIDE2MS4yNiAxMTkuNTc3IDE2MS4yNkMxMjAuOTYzIDE2MS4yNiAxMjIuMzI0IDE2MS42MjUgMTIzLjUyNCAxNjIuMzE3TDEyMy41NjcgMTYyLjM0MVpNMTE3LjYxOSAxNjQuNzc0QzExNi45OSAxNjUuMDY0IDExNi40MyAxNjUuNDg1IDExNS45NzYgMTY2LjAwOUMxMTUuNTMyIDE2Ni41MzMgMTE1LjIyMSAxNjcuMTU1IDExNS4wNjggMTY3LjgyNUgxMjQuMjY1QzEyNC4wOTQgMTY3LjE1NiAxMjMuNzczIDE2Ni41MzYgMTIzLjMyNiAxNjYuMDA5QzEyMi44NzcgMTY1LjQ4OSAxMjIuMzI0IDE2NS4wNjggMTIxLjcwMiAxNjQuNzc0QzEyMS4wNjUgMTY0LjQ3IDEyMC4zNjcgMTY0LjMxMSAxMTkuNjYxIDE2NC4zMTFDMTE4Ljk1NCAxNjQuMzExIDExOC4yNTYgMTY0LjQ3IDExNy42MTkgMTY0Ljc3NFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xMzEuNjk2IDE1Ny44OTFIMTM0Ljk1MVYxNjEuNTQ2SDEzOS42NTJWMTY0LjQ2MUgxMzQuOTUxVjE3MS42MDVDMTM0Ljk0NiAxNzIuMDExIDEzNS4wNTggMTcyLjQxIDEzNS4yNzIgMTcyLjc1NEMxMzUuNDgyIDE3My4wOTkgMTM1Ljc3MiAxNzMuMzg3IDEzNi4xMTkgMTczLjU5NEMxMzYuNDcyIDE3My44MDIgMTM2Ljg3NiAxNzMuOTExIDEzNy4yODYgMTczLjkwOUgxMzkuNzk0VjE3Ni44MTdIMTM2LjU5NEMxMzUuNzI1IDE3Ni44MyAxMzQuODcgMTc2LjYwMSAxMzQuMTI0IDE3Ni4xNTZDMTMzLjM3OSAxNzUuNzIyIDEzMi43NjIgMTc1LjEgMTMyLjMzMiAxNzQuMzUzQzEzMS44OTQgMTczLjYwNCAxMzEuNjY2IDE3Mi43NTEgMTMxLjY3MSAxNzEuODgzVjE2NC40NzNIMTI4Ljc5M1YxNjEuNTU5SDEzMS42NzFMMTMxLjY5NiAxNTcuODkxWiIgZmlsbD0id2hpdGUiLz4KPC9nPgo8L2c+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMTM5N18zNzY0IiB4MT0iLTEzMC4yNCIgeTE9IjE2NS41ODciIHgyPSIzMzAuNjMzIiB5Mj0iMTY1LjU4NyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBvZmZzZXQ9IjAuMjUiIHN0b3AtY29sb3I9IndoaXRlIi8+CjxzdG9wIG9mZnNldD0iMC41IiBzdG9wLWNvbG9yPSIjMDBFNzlEIi8+CjxzdG9wIG9mZnNldD0iMC43NSIgc3RvcC1jb2xvcj0id2hpdGUiLz4KPC9saW5lYXJHcmFkaWVudD4KPGNsaXBQYXRoIGlkPSJjbGlwMF8xMzk3XzM3NjQiPgo8cmVjdCB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgcng9IjgiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjxjbGlwUGF0aCBpZD0iY2xpcDFfMTM5N18zNzY0Ij4KPHJlY3Qgd2lkdGg9IjE5MiIgaGVpZ2h0PSIxOTIiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==',
    getInterface: async () => ({
        provider: (window as any).gatewallet,
    }),
    platforms: ['all'],
    externalUrl: 'https://www.gate.io/web3'
};

const allInjectedWallets = [
    ...officialInjectedWallets,
    cactusLink,
    gateWallet
];

// handle auto connect
const onboardConnectedWallets = getWeb3OnboardConnectedWallets();
const walletConnectionState = getWalletConnectionState();
const autoConnectLastWallet = walletConnectionState.autoConnect
    && allInjectedWallets.some(w => w.label === walletConnectionState.name) // only enable auto connect of injected wallets, otherwise buggy
    && walletConnectionState.name === onboardConnectedWallets[0]; // the updates of onboardConnectedWallets is buggy, especially when switching between injected wallets

export type Web3OnboardContextProviderProps = {
    initOptions: Partial<Omit<InitOptions, 'chains'>> & {chains: InitOptions['chains']}
    injectedWalletOptions?: InjectedWalletOptions
    walletConnectOptions?: Parameters<typeof walletConnectModule>[0]
    arrangeWallets?: (injected: WalletInit, walletConnect: WalletInit) => WalletInit[]
    injectedWalletSortOrders?: string[]
}

const defaultArrangeWallets = (injected: WalletInit, walletConnect: WalletInit) => [injected, walletConnect];
const defaultInjectedWalletSortOrders = [
    ProviderLabel.MetaMask,
    ProviderLabel.Rabby,
    ProviderLabel.Binance,
    ProviderLabel.OKXWallet,
    ProviderLabel.Coin98Wallet,
    CustomizedProviderLabel.GateWallet
];

export const Web3OnboardContextProvider: React.FCD<Web3OnboardContextProviderProps> = ({
    children,
    initOptions,
    injectedWalletOptions,
    walletConnectOptions,
    arrangeWallets = defaultArrangeWallets,
    injectedWalletSortOrders = defaultInjectedWalletSortOrders
}) => {
    const [web3Onboard, setWeb3Onboard] = useState<OnboardAPI>();

    useEffect(() => {
        const initWeb3Onboard = () => {
            const injected = injectedModule({
                custom: [
                    cactusLink,
                    gateWallet
                ],

                displayUnavailable: [
                    ProviderLabel.MetaMask,
                    ProviderLabel.OKXWallet,
                    ProviderLabel.Coin98Wallet
                ],

                walletUnavailableMessage: wallet => {
                    if (wallet.label === ProviderLabel.MetaMask) { // hack to open in MetaMask directly on mobile
                        if (isMobile) {
                            const metaMaskExternalUrl = `https://metamask.app.link/dapp/${location.host}/${location.pathname}`;

                            return `Click <a href="${metaMaskExternalUrl}" target="_blank">here</a> to open in MetaMask`;
                        }

                        if (isRabby()) {
                            return 'You need to disable Rabby to use MetaMask';
                        }
                    }

                    const externalUrl = allInjectedWallets.find(w => w.label === wallet.label)?.externalUrl;
                    if (externalUrl) {
                        return `Please <a href="${externalUrl}" target="_blank">install</a> or enable ${wallet.label} to continue`;
                    }

                    return `Please install or enable ${wallet.label} to continue`;
                },

                sort: (wallets: WalletModule[]) => wallets.sort((a, b) => {
                    const aIndex = injectedWalletSortOrders.includes(a.label as ProviderLabel) ? injectedWalletSortOrders.indexOf(a.label as ProviderLabel) : Infinity;
                    const bIndex = injectedWalletSortOrders.includes(b.label as ProviderLabel) ? injectedWalletSortOrders.indexOf(b.label as ProviderLabel) : Infinity;

                    return aIndex - bIndex;
                }),

                ...injectedWalletOptions
            });

            // Ref: https://cloud.walletconnect.com/
            const walletConnect = walletConnectModule({
                version: 2,
                ...walletConnectOptions
            });

            // fully deprecated
            // const walletConnectV1 = (helpers: WalletHelpers) => {
            //     const v1 = walletConnectModule({
            //         version: 1,
            //         bridge: 'https://derelay.rabby.io'
            //     })(helpers) as WalletModule;

            //     v1.label = 'WalletConnect v1';

            //     return v1;
            // };

            const wallets: InitOptions['wallets'] = arrangeWallets(injected, walletConnect);

            const options: InitOptions = {
                wallets,

                accountCenter: {
                    desktop: {
                        enabled: false
                    },

                    mobile: {
                        enabled: false
                    }
                },

                connect: {
                    // this option is buggy, if connected to multi wallet, the chains will flip
                    // autoConnectAllPreviousWallet: walletConnectionState.autoConnect, 
                    autoConnectLastWallet
                },

                ...initOptions
            };

            setWeb3Onboard(init(options));
        };

        if (document.readyState === 'complete') { // wait for injected wallets to be ready
            initWeb3Onboard();

            return;
        }

        window.addEventListener('load', initWeb3Onboard);

        return () => {
            window.removeEventListener('load', initWeb3Onboard);
        };
    }, [arrangeWallets, initOptions, injectedWalletOptions, injectedWalletSortOrders, walletConnectOptions]);

    if (!web3Onboard) {
        return (
            <Flex sx={{minHeight: '100vh', justifyContent: 'center', alignItems: 'center'}}>
                <Spinner />
            </Flex>
        );
    }

    return (
        <Web3OnboardProvider web3Onboard={web3Onboard}>
            {children}
        </Web3OnboardProvider>
    );
};
