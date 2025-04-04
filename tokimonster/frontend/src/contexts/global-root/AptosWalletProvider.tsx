import {AptosWalletAdapterProvider} from '@aptos-labs/wallet-adapter-react';

const AptosWalletProvider: React.FCD = ({children}) => {
    return (
        <AptosWalletAdapterProvider autoConnect>
            {children}
        </AptosWalletAdapterProvider>
    );
};

export default AptosWalletProvider;
