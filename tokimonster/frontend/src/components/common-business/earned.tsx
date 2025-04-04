import {BigNumber} from 'ethers';
import {useCallback, useMemo} from 'react';
import {Box, Flex, Text, Button, ThemeUIStyleObject} from 'theme-ui';

import Cond from '@shared/fe/component/cond';
import {getAmount, getMoney} from '@shared/fe/util/math';

import SummaryData, {SummaryDataPropsWithoutTitle} from 'src/components/common-business/summary-data';
import {BNumberComponent} from 'src/components/numeric/big-number';

export type RewardTokenInfo = {
    address?: string
    symbol?: string
    amount?: BigNumber
    usd?: BigNumber
}

export type EarnedProp = SummaryDataPropsWithoutTitle & {
    amount?: BigNumber
    remind?: React.ReactNode | string
    rewardTokens?: RewardTokenInfo[]

    onClaim?: () => void
    loading?: boolean // claim button loading
    claimButtonSx?: ThemeUIStyleObject
};

const placeholder = '--';

const Earned: React.FCC<EarnedProp> = ({
    amount,
    remind,
    rewardTokens,

    onClaim,
    loading,
    claimButtonSx,

    // props from SummaryData
    label = 'Earned',
    ...props
}) => {
    const claim = useCallback((event: any) => {
        event.stopPropagation();
        onClaim?.();
    }, [onClaim]);

    const hasRewards = useMemo(
        () => rewardTokens?.some(({amount, usd}) => usd?.noneZero() || amount?.noneZero()) ?? false,
        [rewardTokens]
    );

    return (
        <>
            <SummaryData
                label={label}
                title={(
                    <BNumberComponent
                        value={amount}
                        prettify={{removeTrailingZero: amount?.isZero()}}
                        prefix='$'
                        loading={loading}
                    />
                )}
                tip={(
                    <Box sx={{width: 'fit-content'}}>
                        <Cond
                            cond={remind}
                            fragment
                        >
                            {remind}
                        </Cond>

                        {!rewardTokens?.length ? placeholder : rewardTokens?.map(({symbol, amount, usd}, index) => (
                            <Flex
                                key={index}
                                sx={{justifyContent: 'space-between'}}
                            >
                                <Text sx={{mr: 3, fontWeight: 'bold'}}>{symbol}</Text>
                                <Text>{getAmount(amount)}({getMoney(usd)})</Text>
                            </Flex>
                        ))}
                    </Box>
                )}
                {...props}
            />

            {onClaim && (
                <Button
                    variant="claim"
                    disabled={((!amount || amount?.isZero()) && !hasRewards) || loading}
                    onClick={claim}
                    sx={claimButtonSx}
                >
                    Claim
                </Button>
            )}
        </>
    );
};

export default Earned;
