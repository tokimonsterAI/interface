import {Box, Button} from 'theme-ui';

import {useTheme} from 'src/contexts/ThemeContext';
import {TokenCatalogType} from 'src/pages/home/components/token-catalog';

const Swap = ({tokenInfo}: {
  tokenInfo: TokenCatalogType
}) => {
    const {isDarkMode} = useTheme();

    return (
        <Box sx={{overflow: 'auto', maxWidth: '100%', mt: 50, border: `1px solid ${isDarkMode ? 'rgba(253, 253, 253, 0.10)' : '#e5e7eb'}`, borderRadius: 15, p: 4, height: 'fit-content', background: isDarkMode ? '#282828' : 'white'}}>
            <Button
                variant='claim'
                onClick={() => window.open(`https://dex-website-beta.vercel.app/swap?from=0x1::aptos_coin::AptosCoin&to=${tokenInfo.address}`)}
                sx={{
                    borderRadius: 32,
                    width: '100%!important',
                    height: '50px!important',
                    background: 'rgb(0, 214, 214)',
                    fontSize: 18
                }}
            >
                Go to Hyperion to swap
            </Button>
        </Box>
    );
};

export default Swap;
