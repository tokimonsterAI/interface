import {BigNumber} from 'ethers';

export const ensure = (num?: number, defaultValue = 0) => num ?? defaultValue;

export function isValidNumber(num?: number): num is number {
    return typeof num === 'number' && !isNaN(num);
}

const defaultPlaceholder = '--';

export const getAmount = (amount?: BigNumber, placeholder = defaultPlaceholder, precision = 4) => {
    if (!amount) return placeholder;
    const minimumAmount = (1 / Math.pow(10, precision)).toString();
    if (amount?.lt(BigNumber.fromDecimal(minimumAmount)) && amount?.gt(BigNumber.ZERO)) return `<${minimumAmount}`;

    return `${amount?.prettify({precision, removeTrailingZero: true})}`;
};

export const getMoney = (money?: BigNumber, placeholder = defaultPlaceholder) => {
    if (!money) return placeholder;
    if (money?.lt(BigNumber.fromDecimal('0.01')) && money?.gt(BigNumber.ZERO)) return '<$0.01';

    return `$${money?.prettify({precision: 2, removeTrailingZero: true})}`;
};

export const getPercentage = (numerator?: BigNumber, denominator?: BigNumber) => {
    if (!numerator?.noneZero() || !denominator?.noneZero()) return BigNumber.ZERO;

    const percent = numerator.changeDecimals(18, 36).div(denominator);

    return percent;
};
