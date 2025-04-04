import {Contract} from 'ethers';

export type ContractFetchRequest = {
    [ key: string ]: Array<any> | undefined
} | any[][]

export function contractFetch(
    contract?: Contract | null,
    request?: ContractFetchRequest | [string, Array<any>][]
): Promise<any> {
    if (!contract || !request) {
        console.warn('Empty contract or request detected!', {request}); // eslint-disable-line no-console

        return Promise.resolve();
    }

    // support for calling same method width different args at same time
    const isArrayRequest = Array.isArray(request);
    const pairs = isArrayRequest ? request : Object.entries(request);
    if (!pairs.length) {
        console.warn('Empty request detected!'); // eslint-disable-line no-console

        return Promise.resolve();
    }

    const promises = pairs.map(([name, args]) => contract?.[name] && args ? contract[name](...args) : Promise.resolve());

    return Promise.all(promises).then(responses => {
        if (isArrayRequest) {
            return pairs.map(([name], index) => [name, responses[index] ?? null]);
        }

        return pairs.reduce((acc: any, [name], index) => {
            acc[name] = responses[index] ?? null; // return null represents the request is done

            return acc;
        }, {});
    });
}

export type BatchContractFetchRequest = {
    requests: {
        contract: Contract
        request: ContractFetchRequest
    }[]
}

export function batchContractFetch<T>(request?: BatchContractFetchRequest): Promise<T[] | undefined> {
    if (!request) {
        console.warn('Empty request detected!', {request}); // eslint-disable-line no-console

        return Promise.resolve(undefined);
    }

    const promises = request.requests.map(({contract, request}) => contractFetch(contract, request));

    return Promise.all(promises).catch(() => undefined);
}
