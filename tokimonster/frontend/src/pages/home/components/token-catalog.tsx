import {NavLink} from 'react-router-dom';
import {Box, Card, Flex, Heading, Image, Text} from 'theme-ui';

import MaskAddress from '@shared/fe/component/mask-address';

import {useTheme} from 'src/contexts/ThemeContext';

import {timeAgo} from '../utils/time';
export const DEFAULT_PIC = 'https://testnet.tokimonster.io/static/default-token-image.jpeg';

export type TokenCatalogType = {
    tokenPic?: any
    tokenName?: string
    symbol?: string
    releaseTime?: number
    twitterAvatar?: any
    twitterId?: string
    twitterName?: string
    twitterFollowers?: number
    address?: string
}

const TokenCatalog = ({
    tokenPic,
    tokenName,
    symbol,
    releaseTime,
    twitterAvatar,
    twitterName,
    // twitterFollowers,
    address
}: TokenCatalogType) => {
    const {isDarkMode} = useTheme();

    return (
        <NavLink to={`/token/${address}`}>
            <Card
                sx={{
                    w: '100%',
                    px: 4,
                    py: 6,
                    mb: 4,
                    borderRadius: 32,
                    border: `2px solid ${isDarkMode ? 'rgba(253, 253, 253, 0.10)' : '#E2E2E2'}`,
                    cursor: 'pointer',
                    boxShadow: '0px 32px 64px -12px rgba(0, 0, 0, 0.08), 0px 2.15px 0.5px -2px rgba(0, 0, 0, 0.25), 0px 24px 24px -16px rgba(8, 8, 8, 0.04), 0px 6px 13px 0px rgba(8, 8, 8, 0.03), 0px 6px 4px -4px rgba(8, 8, 8, 0.05), 0px 5px 1.5px -4px rgba(8, 8, 8, 0.05)'
                }}
            >
                <Flex sx={{alignItems: 'center'}}>
                    <Image
                        key={tokenName}
                        src={tokenPic || DEFAULT_PIC}
                        sx={{height: 76, width: 76, borderRadius: 5, flexShrink: 0}}
                    />
                    <Box sx={{ml: 3}}>
                        <Heading sx={{
                            fontSize: 16,
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            width: '100%'
                        }}
                        >{tokenName}</Heading>
                        <Box>
                            <Text sx={{color: '#6b7280', fontSize: 14}}>{symbol}</Text>
                            <Text sx={{ml: 2, color: '#9ca3af', fontSize: '12px'}}>{timeAgo(releaseTime)}</Text>
                        </Box>
                        <Box sx={{color: '#2563EB'}}>
                            <Image
                                src={twitterAvatar}
                                sx={{width: 20, height: 20, borderRadius: '100%'}}
                            />
                            <Text sx={{ml: 2}}>{twitterName}</Text>
                            {/* <Text sx={{ml: 1}}>({twitterFollowers} followers)</Text> */}
                        </Box>
                        <Box sx={{color: '#4B5563'}}>
                            Address: <MaskAddress address={address}></MaskAddress>
                        </Box>
                    </Box>

                </Flex>
            </Card>
        </NavLink>
    );
};

export default TokenCatalog;
