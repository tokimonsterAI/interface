import {BigNumber} from 'ethers';
import {useState, useMemo} from 'react';

import {useAccountContext} from 'src/contexts/GlobalContext';
import {Network} from 'src/contracts/networks';

export default function useValidate({
    tokenName,
    amount,
    isApproved,
    userBalance,
    checkSliToleranceAmount = false,
    sliToleranceAmount,
}: {
    tokenName: string
    amount?: BigNumber
    isApproved: boolean
    userBalance: BigNumber

    checkSliToleranceAmount?: boolean
    sliToleranceAmount?: string | number | boolean
}): any {
    const [validateDes, setValidateDes] = useState<string | undefined>(undefined);

    const validate = (onlySubmit = false) => {
        if (!isApproved) {
            setValidateDes('You need to approve more allowance.');
        } else {
            const slippageMin = 0.01;
            const slippageMinSuccess = 0.5;
            const slippageMax = 99.99;
            const isInvalidSlippage = !sliToleranceAmount || Number(sliToleranceAmount) < slippageMin || Number(sliToleranceAmount) > slippageMax;
            const isMayFailSlippage = sliToleranceAmount && Number(sliToleranceAmount) < slippageMinSuccess;
            if (onlySubmit && amount?.isZero()) {
                setValidateDes('Please fill in the amount.');
            } else if (amount && userBalance && amount?.gt(userBalance)) {
                setValidateDes(`You don't have enough ${tokenName}.`);
            } else if (checkSliToleranceAmount && (isInvalidSlippage || isMayFailSlippage)) {
                setValidateDes(
                    isInvalidSlippage ?
                        `Slippage Tolerance should be between ${slippageMin}%-${slippageMax}%.` :
                        `Slippage Tolerance is lower than ${slippageMinSuccess}%. Your transaction may fail.`
                );

                if (!isInvalidSlippage) return true;
            } else {
                setValidateDes(undefined);

                return true;
            }
        }

        return false;
    };

    return [
        validateDes,
        validate
    ];
}

type ValidationResult = [boolean, string] | [boolean]

export const useWalletConnectionValidation = (): ValidationResult => {
    const {active} = useAccountContext();
    if (!active) {
        return [false, 'Please connect to your wallet'];
    }

    return [true];
};

export const useNetworkValidation = (targetNetwork?: Network): ValidationResult => {
    const {chainId} = useAccountContext();
    if (chainId !== targetNetwork?.chainId) {
        return [false, `Please switch to ${targetNetwork?.chainName} network first`];
    }

    return [true];
};

type ValidateAmountParam = {
    balanceOf?: BigNumber | null
    allowance?: BigNumber | null
    symbol?: string
}

export const validateNonZeroAmount = (amount?: BigNumber, tip = 'Please fill in the amount'): ValidationResult => {
    if (!amount || amount.isZero()) {
        return [false, tip];
    }

    return [true];
};

export const validateAmount = (amount?: BigNumber, param: ValidateAmountParam | null = {}): ValidationResult => {
    if (!amount) {
        return [false, 'Please fill in the amount'];
    }

    const exceedsMaxAmount = param?.balanceOf?.lt(amount);
    const exceedsAllowance = param?.allowance?.lt(amount);

    if (exceedsMaxAmount) {
        return [false, `You don't have enough ${param?.symbol || 'balance'}.`];
    }

    if (exceedsAllowance) {
        return [false, 'You need to approve more allowance.'];
    }

    if (amount.isZero()) {
        return [false, 'Please fill in non-zero amount'];
    }

    return [true];
};

export const validateWeek = (week?: number): ValidationResult => {
    if (!week) {
        return [false, 'Please select weeks'];
    }

    return [true];
};

// 
export const useStartedOrWhitelistedValidation = (startTime?: string, whitelist?: string[], account?: string | null): ValidationResult => {
    const isStarted = useMemo(() => {
        if (!startTime) {
            return false;
        }

        return Date.now() >= new Date(startTime).getTime();
    }, [startTime]);

    const isWhitelisted = useMemo(() => {
        if (!whitelist || !account) {
            return false;
        }

        return whitelist.includes(account) || whitelist.includes(account.toLowerCase());
    }, [account, whitelist]);

    if (isStarted || isWhitelisted) {
        return [true];
    }

    return [false, 'Please wait for the launch'];
};
