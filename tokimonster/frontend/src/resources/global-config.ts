import {convertRowsToConfig, GetValuesParams} from '@shared/fe/util/google-sheets';

import {getValues} from './google-sheets';

type FetchGlobalConfigResponseJson = {
    range?: string
    majorDimension?: string
    values?: [string, any][]
}

// NOTE: the configuration must be write as this format in the google sheet
// keep all fields & sub fields as optional to avoid breaking when config is changed
export type GlobalConfig = {
    // to be added
}

export const TEST_SHEET_ID = '1PNhp60bcTOoFNC516AYA9qBMIqUPyoaFzFgAEqGJAXw';
export const PROD_SHEET_ID = '1HJN0QCG5jsQOBebMnCHAhL1qt02iaXd09yU3yIQxaQY';

export const fetchGlobalConfigParams: GetValuesParams = {sheetName: 'config', range: 'A2:B'};

const fetchGlobalConfig = async (sheetId: string) => {
    const response = await getValues(sheetId, fetchGlobalConfigParams);

    const data: FetchGlobalConfigResponseJson = await response?.json();

    return convertRowsToConfig<GlobalConfig>(data?.values);
};

export const fetchGlobalConfigInBrowser = () => {
    return Promise.resolve({});
    // return fetchGlobalConfig(isTestOrDevEnv() ? TEST_SHEET_ID : PROD_SHEET_ID);
};

type FetchGlobalConfigInNodeOptions = {
    isTestnet?: boolean
}

export const fetchGlobalConfigInNode = ({isTestnet}: FetchGlobalConfigInNodeOptions) => {
    return fetchGlobalConfig(isTestnet ? TEST_SHEET_ID : PROD_SHEET_ID);
};
