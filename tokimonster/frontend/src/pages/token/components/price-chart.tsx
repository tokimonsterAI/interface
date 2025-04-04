import {useMemo} from 'react';
import {Box} from 'theme-ui';

import {useContractFetch, useContract} from '@shared/fe/hook/use-contract';

import {useTheme} from 'src/contexts/ThemeContext';
import HyperFactoryAbi from 'src/contracts/abi/HyperFactory.json';
import {bscMain} from 'src/contracts/networks';
import {useRPCProvider} from 'src/hooks/use-rpc-provider';
import {TokenCatalogType} from 'src/pages/home/components/token-catalog';

const network = bscMain; 

const PriceChart = ({tokenInfo}: {
  tokenInfo: TokenCatalogType
}) => {
    const {address} = tokenInfo || {};
    const {isDarkMode} = useTheme();
    const provider = useRPCProvider(network);
        const hyperFactoryContract = useContract('0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865', HyperFactoryAbi, provider);

    const [poolState] = useContractFetch<{getPool: string}>(
        hyperFactoryContract,
        {
            getPool: address ? [address, '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', 10000] : undefined,
        },
        {
            cacheKey: `${network.chainId}-address`,
            cachePool: 'price-chart',
        }
    );
    const iframeUrl = useMemo(
        () => poolState?.getPool && `https://dexscreener.com/bsc/${poolState?.getPool}?embed=1&loadChartSettings=0&trades=0&tabs=0&info=0&chartLeftToolbar=0&chartTheme=dark&theme=light&chartStyle=0&chartType=usd&interval=15`,
        [poolState?.getPool]);

    return (
        <Box sx={{mt: 50, border: `1px solid ${isDarkMode ? 'rgba(253, 253, 253, 0.10)' : '#e5e7eb'}`, borderRadius: 15, p: 4, height: 'fit-content', background: isDarkMode ? '#282828' : 'white'}}>
            <iframe
                src={iframeUrl}
                allow="clipboard-write"
                sx={{width: '100%', height: '400px', border: 'none'}}
            ></iframe>
        </Box>
    );
};

export default PriceChart;
