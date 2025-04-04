import {Network} from '@aptos-labs/ts-sdk';
import {useWallet} from '@aptos-labs/wallet-adapter-react';
import {useCallback} from 'react';
import {Box} from 'theme-ui';

import ListSelector from 'src/components/basic-ui/list-selector';

export const SUPPORTED_NETWORKS = [
    // Network.MAINNET,
    Network.TESTNET
];

const NetworkSelector: React.FC = () => {
    const {
        network: currentNetwork,
        changeNetwork
    } = useWallet();

    const getNetworkName = useCallback((network: Network) => {
        if (currentNetwork?.name === network) {
            return `${network} (Current)`;
        }

        return network;
    }, [currentNetwork]);

    return (
        <Box sx={{minWidth: '200px'}}>
            <ListSelector
                items={SUPPORTED_NETWORKS}
                getLabel={getNetworkName}
                onSelect={network => changeNetwork?.(network)}
            />
        </Box>
    );
};

export default NetworkSelector;
