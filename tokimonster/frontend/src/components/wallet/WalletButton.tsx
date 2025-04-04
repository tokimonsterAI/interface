import {
    truncateAddress,
    useWallet
} from '@aptos-labs/wallet-adapter-react';
import {Text, Box, BoxProps} from 'theme-ui';

import {Button} from 'src/components/basic-ui/button';
import {useWalletContext} from 'src/contexts/global-core';

const WalletButton: React.FC<BoxProps> = props => {
    const {
        toggleWallet,
        toggleWalletSelector
    } = useWalletContext();

    const {
        account,
        connected,
        isLoading
    } = useWallet();

    return (
        <Box {...props} >
            {connected && !!account && (
                <Button
                    variant="header-primary"
                    onClick={() => toggleWallet?.(true)}
                    loading={isLoading}
                >
                    <Text>{account?.ansName || truncateAddress(account?.address?.toString())}</Text>
                </Button>
            )}

            {!account && (
                <Button
                    variant="header-primary"
                    onClick={() => toggleWalletSelector?.(true)}
                    loading={isLoading}
                >
                    Connect Wallet
                </Button>
            )}
        </Box>
    );
};

export default WalletButton;
