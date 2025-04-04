import {Fragment} from 'react';
import {Box, Link} from 'theme-ui';

import MaskAddress from '@shared/fe/component/mask-address';

import {useAccountContext} from 'src/contexts/GlobalContext';
import {Network, getSupportedOrDefaultNetwork} from 'src/contracts/networks';

type InfoProp = {
    infos: string[][]
    network?: Network
};

const Info: React.FCC<InfoProp> = ({infos, network, className}) => {
    const {chainId: signerChainId} = useAccountContext();
    const blockLink = (network || getSupportedOrDefaultNetwork(signerChainId))?.blockScanUrl;

    return (
        <Box
            className={className}
            sx={{
                py: [2, 4],
                display: 'grid',
                gridTemplateColumns: 'auto auto',
                columnGap: 3,
                rowGap: 2,
                bg: 'poolHeaderBg',
            }}
        >
            {infos.map(([label, address]) => (
                <Fragment key={label}>
                    <Box
                        sx={{
                            textAlign: 'right'
                        }}
                    >
                        {label}{' '}address
                    </Box>

                    <Link
                        variant="reset"
                        href={`${blockLink}/address/${address}`}
                        target="_blank"
                        sx={{
                            fontWeight: 'bold'
                        }}
                    >
                        <MaskAddress
                            address={address}
                            responsiveSettings={MaskAddress.defaultSettings.concat(null as any)}
                        />
                    </Link>
                </Fragment>
            ))}
        </Box>
    );
};

export default Info;
