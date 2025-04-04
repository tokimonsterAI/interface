// import {useWallet} from '@aptos-labs/wallet-adapter-react';
import {useParams} from 'react-router-dom';
import {Box, Flex, Image} from 'theme-ui';

import {useTheme} from 'src/contexts/ThemeContext';
// import {getAddress} from 'src/contracts/networks';
// import {useContractFetch} from 'src/hooks/use-aptos-contract-fetch';
import {useFetchTokens} from 'src/hooks/use-fetch-tokens';

import Back from './assets/back.svg';
// import PriceChart from './components/price-chart';
import Swap from './components/swap';
import TokenInfo from './components/token-info';
import Tweet from './components/tweet';

const TokenPage = () => {
    const {address: tokenAddress} = useParams();
    const [tokens] = useFetchTokens();
    const {isDarkMode} = useTheme();
    const tokenInfo = tokens?.find(token => token.address?.toLocaleLowerCase() === tokenAddress?.toLocaleLowerCase());

    return (
        <Flex sx={{pt: 40, alignItems: 'flex-start', flexDirection: ['column', 'column', 'row']}}>
            <Image
                src={Back}
                sx={{width: 48, cursor: 'pointer'}}
                onClick={() => window.history.back()}
            ></Image>

            {tokenInfo &&
            <>
                <Box sx={{mt: [2, 0], p: [15, 50], width: ['100%', '70%'], ml: [0, '15%'], borderRadius: 32, border: `2px solid ${isDarkMode ? 'rgba(253, 253, 253, 0.10)' : '#E2E2E2'}`, background: isDarkMode ? 'linear-gradient(180deg, rgba(151, 151, 151, 0.15) 0%, rgba(0, 0, 0, 0.15) 100%)' : 'linear-gradient(180deg, rgba(253, 253, 253, 0.23) 0%, rgba(253, 253, 253, 0.75) 100%)'}}>
                    <TokenInfo tokenInfo={tokenInfo} />
                    <Tweet tokenInfo={tokenInfo} />
                    {/* <PriceChart tokenInfo={tokenInfo} /> */}
                    <Swap tokenInfo={tokenInfo} />
                </Box>
            </>}
        </Flex>
    );
};

export default TokenPage;
