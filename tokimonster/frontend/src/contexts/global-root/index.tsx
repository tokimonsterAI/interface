import AptosWalletProvider from './AptosWalletProvider';

export const GlobalRootContextProvider: React.FCD = ({children}) => {
    return (
        <AptosWalletProvider>
            {children}
        </AptosWalletProvider>
    );
};
