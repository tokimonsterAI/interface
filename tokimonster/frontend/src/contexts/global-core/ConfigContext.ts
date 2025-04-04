import {useMemo} from 'react';

import {AutoFetchState, useAutoFetch} from '@shared/fe/hook/use-fetch';

import {fetchGlobalConfigInBrowser, GlobalConfig} from 'src/resources/global-config';

export type ConfigContextType = {
    config?: GlobalConfig
    configFetchingState?: AutoFetchState
    refreshConfig?: () => void
}

export const initialConfigContext: ConfigContextType = {};

export function useConfigContextProvider(): ConfigContextType {
    const [config = {}, refreshConfig, configFetchingState] = useAutoFetch(fetchGlobalConfigInBrowser);

    return useMemo(() => ({config, configFetchingState, refreshConfig}), [config, configFetchingState, refreshConfig]);
}
