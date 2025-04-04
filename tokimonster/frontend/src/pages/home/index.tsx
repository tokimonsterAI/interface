// import {useWallet} from '@aptos-labs/wallet-adapter-react';
import {useResponsiveValue} from '@theme-ui/match-media';
import {Pagination, Input} from 'antd';
import {useState, useMemo} from 'react';
import {Box, Flex, Image, Text} from 'theme-ui';

import Cond from '@shared/fe/component/cond';

import {LoadingOverlay} from 'src/components/basic-ui/loading-overlay';
import {useTheme} from 'src/contexts/ThemeContext';
// import {getAddress} from 'src/contracts/networks';
// import {useBatchContractFetch} from 'src/hooks/use-aptos-contract-fetch';
import {useFetchTokens} from 'src/hooks/use-fetch-tokens';

import use01_dark from './assets/dark/01.png';
import use02_dark from './assets/dark/02.png';
import use03_dark from './assets/dark/03.png';
import use04_dark from './assets/dark/04.png';
import HowToUse_dark from './assets/dark/howToUse.png';
import shadow from './assets/dark/shadow.png';
import Sleleton_dark from './assets/dark/skeleton.png';
import HowToUse from './assets/howToUse.png';
import Sleleton from './assets/skeleton.png';
import TokenCatalog, {TokenCatalogType} from './components/token-catalog';

const HomePage = () => {
    const {isDarkMode} = useTheme();
    const use01Img = isDarkMode ? use01_dark : use01;
    const use02Img = isDarkMode ? use02_dark : use02;
    const use03Img = isDarkMode ? use03_dark : use03;
    const use04Img = isDarkMode ? use04_dark : use04;
    const HowToUseImg = isDarkMode ? HowToUse_dark : HowToUse;
    const SleletonImg = isDarkMode ? Sleleton_dark : Sleleton;
    const isMobile = useResponsiveValue([true, true, false]);

    const [tokens, tokenListState] = useFetchTokens();
    const [page, setPage] = useState(1);
    const [inputValue, setInputValue] = useState('');
    //根据inputValue匹配tokenName和symbol和address筛选tokens, 大小写都支持
    const filterTokens = useMemo(() => {
        return tokens?.filter(token => {
            return token.tokenName?.toLowerCase()?.includes(inputValue?.toLowerCase())
            || token.symbol?.toLowerCase()?.includes(inputValue?.toLowerCase())
            || token.address?.toLowerCase()?.includes(inputValue?.toLowerCase());
        });
    }, [inputValue, tokens]);

    const showTokens: TokenCatalogType[] = useMemo(() => {
        if (!filterTokens || !page) return [];

        return filterTokens?.slice((page - 1) * 6, page * 6);
    }, [filterTokens, page]);

    return (
        <Box>
            <Box sx={{maxWidth: '100%'}}>
                <Cond
                    cond={isMobile}
                    fragment
                >
                    <Box sx={{my: 40}}>
                        <Image
                            src={use01Img}
                            sx={{width: '100%'}}
                        ></Image>
                        <Image
                            src={use02Img}
                            sx={{width: '100%'}}
                        ></Image>
                        <Image
                            src={use03Img}
                            sx={{width: '100%'}}
                        ></Image>
                        <Image
                            src={use04Img}
                            sx={{width: '100%'}}
                        ></Image>
                    </Box>
                    <Box sx={{position: 'relative', my: 40}}>
                        <Image src={SleletonImg}></Image>
                        <Image
                            src={HowToUseImg}
                            sx={{width: isDarkMode ? 360 : 400, position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)'}}
                        ></Image>
                        <Image
                            src={shadow}
                            sx={{width: 360, position: 'absolute', bottom: '0%', left: '50%', transform: 'translate(-50%, -50%)'}}
                        ></Image>
                        <Text sx={{position: 'absolute', bottom: '3%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: 32, color: 'secondary'}}>How to use?</Text>
                        <Image
                            src={use01Img}
                            sx={{width: 260, position: 'absolute', top: 20, left: 30}}
                        ></Image>
                        <Image
                            src={use02Img}
                            sx={{width: 260, position: 'absolute', bottom: 20, left: 30}}
                        ></Image>
                        <Image
                            src={use03Img}
                            sx={{width: 260, position: 'absolute', top: 20, right: 30}}
                        ></Image>
                        <Image
                            src={use04Img}
                            sx={{width: 260, position: 'absolute', bottom: 20, right: 30}}
                        ></Image>
                    </Box>
                </Cond>

                <Box sx={{
                    px: ['15px', 50],
                    py: 40,
                    borderRadius: '32px',
                    border: `2px solid ${isDarkMode ? 'rgba(253, 253, 253, 0.10)' : '#E2E2E2'}`,
                    background: isDarkMode ? 'linear-gradient(180deg, rgba(151, 151, 151, 0.15) 0%, rgba(0, 0, 0, 0.15) 100%)' : 'linear-gradient(180deg, rgba(253, 253, 253, 0.23) 0%, rgba(253, 253, 253, 0.75) 100%)'
                }}
                >
                    <Flex sx={{alignItems: 'center', justifyContent: 'space-between', flexDirection: ['column', 'row']}}>
                        <Box sx={{color: 'text', fontWeight: 700, fontSize: 24, whiteSpace: 'nowrap', width: ['100%', '400px']}}>{tokens.length} tokens deployed</Box>

                        <Input
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            placeholder="Search by token name, symbol, address"
                            sx={{color: 'white', width: '100%', height: 50, lineHeight: 50, my: 4, borderRadius: 1024, background: 'transparent'}}
                        />
                    </Flex>

                    <Box sx={{
                        mt: 30,
                        display: 'grid',
                        gridTemplateColumns: ['1fr', '1fr 1fr', '1fr 1fr 1fr'],
                        gap: 2
                    }}
                    >
                        {showTokens && showTokens.map(token => (
                            <TokenCatalog
                                key={token.address}
                                tokenPic={token.tokenPic}
                                tokenName={token.tokenName}
                                symbol={token.symbol}
                                releaseTime={token.releaseTime}
                                twitterAvatar={token.twitterAvatar}
                                twitterName={token.twitterName}
                                twitterFollowers={token.twitterFollowers}
                                address={token.address}
                            />
                        ))}
                    </Box>

                    {tokenListState?.loading && <LoadingOverlay />}

                    {!tokenListState?.loading && filterTokens?.length === 0 &&
                    <Box sx={{textAlign: 'center', fontSize: 20, color: '#6b7280'}}>No token found</Box>}

                    {!tokenListState?.loading && filterTokens?.length > 0 &&
                    <Pagination
                        sx={{margin: '30px auto 0', textAlign: 'center'}}
                        simple
                        pageSize={6}
                        total={filterTokens?.length}
                        onChange={page => setPage(page)}
                    />}
                </Box>
            </Box>
        </Box>
    );
};

export default HomePage;
