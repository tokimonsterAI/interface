import {StandardMerkleTree} from '@openzeppelin/merkle-tree';
import {useMemo} from 'react';

import {LEAF_ENCODING} from '../util/merkle-tree';

const defaultLeafEncoding = LEAF_ENCODING.SINGLE_AMOUNT;

export type MerkleTreeData<Leaf extends any[]> = {
    leaves?: Leaf[]
    leafEncoding?: string[]
}

export const findLeaf = <Leaf extends any[]>(
    leaves?: Leaf[],
    key?: Leaf[0] | null
): Leaf | undefined => {
    return leaves?.find(([_key]) => {
        if (_key === key) {
            return true;
        }

        if (typeof _key === 'string' && typeof key === 'string') {
            return (_key as string).toLowerCase() === (key as string).toLowerCase();
        }

        return false;
    });
};

export const useMerkleTree = <Leaf extends any[]>(values?: Leaf[], leafEncoding: string[] = defaultLeafEncoding) => {
    const tree = useMemo(() => {
        if (!values || !values.length) {
            return undefined;
        }

        return StandardMerkleTree.of(values, leafEncoding);
    }, [leafEncoding, values]);

    return [tree] as const;
};
