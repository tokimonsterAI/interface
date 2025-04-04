import {useMemo, useState} from 'react';

export type WalletContextType = {
    isWalletOpen?: boolean
    toggleWallet?: (open?: boolean) => void

    isWalletSelectorOpen?: boolean
    toggleWalletSelector?: (open?: boolean) => void
}

export const initialWalletContext: WalletContextType = {};

export function useWalletContextProvider(): WalletContextType {
    const [isWalletOpen, toggleWallet] = useState<boolean>();
    const [isWalletSelectorOpen, toggleWalletSelector] = useState<boolean>();

    return useMemo(() => ({
        isWalletOpen,
        toggleWallet,
        isWalletSelectorOpen,
        toggleWalletSelector
    }), [isWalletOpen, isWalletSelectorOpen]);
}
