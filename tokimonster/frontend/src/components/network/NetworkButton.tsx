import {useWallet} from '@aptos-labs/wallet-adapter-react';
import {Popover} from 'antd';
import {useEffect, useState} from 'react';

import {Button} from 'src/components/basic-ui/button';

import NetworkSelector, {SUPPORTED_NETWORKS} from './NetworkSelector';

const NetworkButton = () => {
    const {
        connected,
        network
    } = useWallet();

    const [isSelectorOpen, toggleSelector] = useState(false);
    const isNetworkSupported = network && SUPPORTED_NETWORKS.includes(network.name);

    useEffect(() => {
        if (connected && network && !isNetworkSupported) {
            toggleSelector(true);
        }
    }, [connected, isNetworkSupported, network]);

    if (!connected) {
        return null;
    }

    return (
        <Popover
            open={isSelectorOpen}
            content={<NetworkSelector />}
            trigger="click"
            placement="bottom"
            onOpenChange={toggleSelector}
        >
            <Button
                variant="header-transparent"
            >
                {isNetworkSupported ? network?.name : 'Wrong network'}
            </Button>
        </Popover>

    );
};

export default NetworkButton;
