import {Aptos, AptosConfig, Account, Network} from '@aptos-labs/ts-sdk';

// 创建Aptos客户端实例
export function getAptosClient(network: Network = Network.TESTNET) {
    const config = new AptosConfig({network});

    return new Aptos(config);
}

export type AptosContractFetchRequest = {
  [key: string]: {
    function: string
    typeArguments?: string[]
    functionArguments?: any[]
  }
} | Array<{
  name: string
  function: string
  typeArguments?: string[]
  functionArguments?: any[]
}>

/**
 * 执行Aptos链上的视图函数调用
 * @param moduleAddress 模块地址
 * @param request 请求参数
 * @param client Aptos客户端实例
 */
export function aptosViewFetch(
    moduleAddress: string,
    request?: AptosContractFetchRequest,
    client = getAptosClient()
): Promise<any> {
    if (!moduleAddress || !request) {
        return Promise.resolve();
    }

    // 支持两种调用格式
    const isArrayRequest = Array.isArray(request);
    const pairs = isArrayRequest
        ? request
        : Object.entries(request).map(([name, params]) => ({
            name,
            ...params
        }));

    if (!pairs.length) {
        return Promise.resolve();
    }

    const promises = pairs.map(item => {
        const {function: functionName, typeArguments = [], functionArguments = []} = isArrayRequest ? item : item;

        if (!functionName) {
            return Promise.resolve(null);
        }

        // 调用Aptos视图函数 - 正确格式化函数调用路径
        return client.view({
            payload: {
                function: `${moduleAddress}::${functionName.includes('::') ? functionName : `module::${functionName}`}` as `${string}::${string}::${string}`,
                typeArguments,
                functionArguments
            }
        }).catch(x => x);
    });

    return Promise.all(promises).then(responses => {
        if (isArrayRequest) {
            return pairs.map((item, index) => [item.name, responses[index] ?? null]);
        }

        return pairs.reduce((acc: any, item, index) => {
            acc[item.name] = responses[index] ?? null;

            return acc;
        }, {});
    });
}

/**
 * 执行Aptos链上的交易
 * @param moduleAddress 模块地址
 * @param functionName 函数名称
 * @param typeArguments 类型参数
 * @param functionArguments 函数参数
 * @param account 发送交易的账户
 * @param client Aptos客户端实例
 */
export async function aptosTransactionSubmit(
    moduleAddress: string,
    functionName: string,
    typeArguments: string[] = [],
    functionArguments: any[] = [],
    account: Account,
    client = getAptosClient()
): Promise<any> {
    if (!moduleAddress || !functionName || !account) {
        return Promise.reject(new Error('Missing required parameters'));
    }

    try {
        // 正确格式化函数路径
        const fullFunction = functionName.includes('::')
            ? functionName
            : `${moduleAddress}::module::${functionName}`;

        // 生成交易payload
        const transaction = await client.transaction.build.simple({
            sender: account.accountAddress,
            data: {
                function: fullFunction as `${string}::${string}::${string}`,
                typeArguments,
                functionArguments
            }
        });

        // 签名
        const senderAuthenticator = client.transaction.sign({
            signer: account,
            transaction
        });

        // 提交交易
        const pendingTx = await client.transaction.submit.simple({
            transaction,
            senderAuthenticator
        });

        // 等待交易完成
        return await client.transaction.waitForTransaction({transactionHash: pendingTx.hash});
    } catch (error) {
        return Promise.reject(error);
    }
}

export type BatchAptosViewFetchRequest = {
  requests: {
    moduleAddress: string
    request: AptosContractFetchRequest
  }[]
}

/**
 * 批量执行Aptos视图函数调用
 */
export function batchAptosViewFetch<T>(
    request?: BatchAptosViewFetchRequest,
    client = getAptosClient()
): Promise<T[] | undefined> {
    if (!request) {
        return Promise.resolve(undefined);
    }

    const promises = request.requests.map(({moduleAddress, request}) =>
        aptosViewFetch(moduleAddress, request, client)
    );

    return Promise.all(promises).catch(() => undefined);
}
