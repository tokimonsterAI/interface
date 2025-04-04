import {BigNumber} from 'ethers';

export const LEAF_ENCODING = Object.freeze({
    SINGLE_AMOUNT: ['address', 'uint256'],
    MULTI_AMOUNT: ['address', 'uint256[]']
});

export type LeafEncodeType = keyof typeof LEAF_ENCODING;

export const generateLeaves = (
    values: any[][] | undefined,
    leafEncoding: typeof LEAF_ENCODING[LeafEncodeType]
) => {
    switch (leafEncoding) {
        case LEAF_ENCODING.SINGLE_AMOUNT:
            return values?.slice(1).map(row => [row[0], row[1]]) as Array<[string, string]>; // [address, amount]
        case LEAF_ENCODING.MULTI_AMOUNT:
            return values?.slice(1).map(row => [row[0], row.slice(1)]) as Array<[string, string[]]>; // [address, amount[]]
        default:
            console.error('Invalid leaf encoding', leafEncoding); // eslint-disable-line no-console

            return;
    }
};

export const calculateTotalAmounts = (
    leafEncoding: typeof LEAF_ENCODING[LeafEncodeType],
    leaves: [string, string | string[]][] | undefined,
    headers: string[]
): [string, BigNumber][] => {
    if (!leaves) {
        return [];
    }

    switch (leafEncoding) {
        case LEAF_ENCODING.SINGLE_AMOUNT:
            return [[headers[1], leaves.reduce((acc, leaf) => acc.add(BigNumber.from(leaf[1])), BigNumber.from(0))]];
        case LEAF_ENCODING.MULTI_AMOUNT:
            return headers.slice(1).map((header, index) => {
                return [header, leaves.reduce((acc, leaf) => acc.add(BigNumber.from(leaf[1][index])), BigNumber.from(0))];
            });
        default:
            return [];
    }
};
