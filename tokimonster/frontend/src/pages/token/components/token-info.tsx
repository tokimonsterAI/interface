import {useCallback} from 'react';
import {Box, Flex, Image, Button} from 'theme-ui';

import {useAutoFetch} from '@shared/fe/hook/use-fetch';

import {BNumberComponent} from 'src/components/numeric/big-number';
// import {useWalletContext} from 'src/contexts/GlobalContext';
import {useTheme} from 'src/contexts/ThemeContext';
import {TokenCatalogType} from 'src/pages/home/components/token-catalog';

import {DEFAULT_PIC} from '../../home/components/token-catalog';

export const sendSubgraphQuery = async <T, >(subgraphUrl: string, query: any) => {
    const body = query;
    const response = await fetch(subgraphUrl, {
        method: 'POST',
        body: JSON.stringify(body),
    });
    const json = await response.json();

    return json as T;
};

const subgraphUrl = 'https://api-testnet.hyperion.xyz/v1/graphql';

type SubgraphSystemInfo = {
    dailyVolumeUSD: string
    farmAPR: string
    feeAPR: string
    feesUSD: string
    pool: any
    tvlUSD: string
}

const TokenInfo = ({tokenInfo}: {
  tokenInfo: TokenCatalogType
}) => {
    const {isDarkMode} = useTheme();
    // const {openAddWatchAssetModal} = useWalletContext();
    const {tokenName, tokenPic, address} = tokenInfo || {};

    // const addToWallet = useCallback(() => {
    //     if (!address) return;
    //     openAddWatchAssetModal?.([{
    //         address,
    //         symbol,
    //         decimals: 18,
    //         image: tokenPic
    //     }]);
    // }, [address, openAddWatchAssetModal, symbol, tokenPic]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [poolIdInfo] = useAutoFetch(useCallback(async () => {
        const query =
        {
            query: '\n  query queryPoolByTokenPair($token1: String = "", $token2: String = "", $feeTier: Float = 1.5) {\n    api {\n      getPoolByTokenPair(feeTier: $feeTier, token1: $token1, token2: $token2) {\n        currentTick\n        token1\n        token2\n        poolId\n      }\n    }\n  }\n',
            variables: {
                token1: '0x1::aptos_coin::AptosCoin',
                token2: `${address}`,
                feeTier: 1
            },
            operationName: 'queryPoolByTokenPair'
        };
        const systemInfo = sendSubgraphQuery<{data: {api: {getPoolByTokenPair: {poolId: string}}}}>(subgraphUrl, query);

        return (await systemInfo).data?.api?.getPoolByTokenPair?.poolId;
    }, [address]), {
        cachePool: 'TokenInfoProvider',
        cacheKey: `poolId-${tokenInfo.address}`,
        autoFetch: true
    });

    const [dexInfo,, dexInfoState] = useAutoFetch(useCallback(async () => {
        if (!poolIdInfo) return [] as any;
        const query =
                {
                    operationName: 'queryPoolById',
                    query: '\n  query queryPoolById($poolId: String = "") {\n    api {\n      getPoolStat(poolId: $poolId) {\n        \n  dailyVolumeUSD\n  feesUSD\n  tvlUSD\n  feeAPR\n  farmAPR\n  pool {\n    \n  currentTick\n  feeRate\n  feeTier\n  poolId\n  senderAddress\n  sqrtPrice\n  token1\n  token2\n  token1Info {\n    \n  assetType\n  bridge\n  coinMarketcapId\n  coinType\n  coingeckoId\n  decimals\n  faType\n  hyperfluidSymbol\n  logoUrl\n  name\n  symbol\n  isBanned\n  websiteUrl\n  }\n  token2Info {\n    \n  assetType\n  bridge\n  coinMarketcapId\n  coinType\n  coingeckoId\n  decimals\n  faType\n  hyperfluidSymbol\n  logoUrl\n  name\n  symbol\n  isBanned\n  websiteUrl \n  }\n  farm {\n    poolId\n    emissionsPerSecond\n  }\n \n  }\n \n      }\n    }\n  }\n',
                    variables: {poolId: poolIdInfo}
                };
        const systemInfo = sendSubgraphQuery<{data: {api: {getPoolStat: SubgraphSystemInfo[]}}}>(subgraphUrl, query);

        return (await systemInfo).data?.api?.getPoolStat[0];
    }, [poolIdInfo]), {
        cachePool: 'TokenInfoProvider',
        cacheKey: `token-${tokenInfo.address}`,
        autoFetch: true
    });

    return (
        <Box sx={{border: `1px solid ${isDarkMode ? 'rgba(253, 253, 253, 0.10)' : '#e5e7eb'}`, borderRadius: 15, p: 30, height: 'auto', background: isDarkMode ? '#282828' : 'white'}}>
            <Flex sx={{alignItems: 'center'}}>
                <Image
                    key={tokenName}
                    src={tokenPic || DEFAULT_PIC}
                    sx={{height: 96, width: 96, borderRadius: 5, flexShrink: 0}}
                />
                <Box sx={{ml: 3, color: 'text'}}>
                    <Box sx={{fontSize: 20, fontWeight: 600}}>{tokenName}</Box>
                    <Box>Symbol: {tokenInfo.symbol}</Box>
                    <Box sx={{wordBreak: 'break-all'}}>Address: {tokenInfo.address}</Box>
                    <Box>Creator: @{tokenInfo.twitterName}</Box>
                </Box>
            </Flex>

            <Flex sx={{flexDirection: ['column', 'row'], mt: 3, color: 'text', py: ['10px', 24], px: 30, borderRadius: ['20px', '1024px'], alignItems: 'center', height: [100, 60], border: '1px solid #D9D9D9', justifyContent: 'space-between'}}>
                <Flex sx={{alignItems: 'center'}}>
                    <Box sx={{fontSize: 16, fontWeight: 600}}>MCAP:</Box>
                    <BNumberComponent
                        value={dexInfo?.tvlUSD}
                        loading={dexInfoState?.loading}
                        prefix="$"
                    />
                </Flex>

                <Flex sx={{alignItems: 'center'}}>
                    <Box sx={{ml: 4, fontSize: 16, fontWeight: 600}}>24H Volume:</Box>
                    <BNumberComponent
                        value={dexInfo?.dailyVolumeUSD}
                        loading={dexInfoState?.loading}
                        prefix="$"
                    />
                </Flex>

                <Flex sx={{alignItems: 'center'}}>
                    <Box sx={{ml: 4, fontSize: 16, fontWeight: 600}}>Fee Accrued:</Box>
                    <BNumberComponent
                        value={dexInfo?.feesUSD}
                        loading={dexInfoState?.loading}
                        prefix="$"
                    />
                </Flex>
            </Flex>

            <Flex sx={{
                flexDirection: ['column', 'row'],
                alignItems: 'center',
                mt: 30,
                gap: 3
            }}
            >
                {/* <Button
                    variant='claim'
                    onClick={addToWallet}
                    sx={{
                        borderRadius: 32,
                        width: ['100%!important', '30%!important'],
                        height: '50px!important',
                        background: 'linear-gradient(180deg, #779DFF 0%, #2D68FF 100%)'
                    }}
                >
                    Add to Wallet
                </Button> */}

                <Button
                    variant='claim'
                    onClick={() => window.open(`https://explorer.aptoslabs.com/account/${address}?network=testnet`)}
                    sx={{
                        borderRadius: 32,
                        width: '100%!important',
                        height: '50px!important',
                        background: 'linear-gradient(180deg, #779DFF 0%, #2D68FF 100%)'
                    }}
                >
                    Scan
                </Button>

                {/* <Button
                    variant='claim'
                    onClick={() => window.open(`https://dexscreener.com/bsc/${address}`)}
                    sx={{
                        borderRadius: 32,
                        width: ['100%!important', '30%!important'],
                        height: '50px!important',
                        background: 'linear-gradient(180deg, #779DFF 0%, #2D68FF 100%)'
                    }}
                >
                    Dex Screener
                </Button> */}
            </Flex>
        </Box>
    );
};

export default TokenInfo;
