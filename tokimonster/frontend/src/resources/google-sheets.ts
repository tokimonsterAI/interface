import {getMetaFp, getValuesFp, appendValuesFp} from '@shared/fe/util/google-sheets';

import {isInBrowser, isLocalHost, isProdEnv, baseApiUrl} from 'src/utils/env';

export const baseUrl = (() => {
    if (isInBrowser) {
        return isLocalHost() ? baseApiUrl : undefined;
    }

    const PORT = process.env.PORT;
    if (PORT) { // support fetch google sheets in test/next/prod Node server
        return `http://localhost:${PORT}`;
    }

    return 'https://testnet.tokimonster.io'; // local node server proxy to test env
})();

export type {GetValuesOptions} from '@shared/fe/util/google-sheets';

export const getMeta = getMetaFp({baseUrl});

export const getValues = getValuesFp({baseUrl});

export const appendValues = appendValuesFp({baseUrl});

const PENDLE_CAMPAIGN_SHEET_ID = isProdEnv()
    ? '1nDITuYAyH-KmMDb-vWkt84oIKnOH_I41110Kk1I6sL4' // only prod node service have permission to write to this sheet
    : '1OvpFAOhYVX8q3ec7ns0mIjOBea9d8d8-MhNdzPLSR6Y';

export const setPendleCampaignPreferredChain = (address: string, chain: string, pendleStaked: string) =>
    appendValues(PENDLE_CAMPAIGN_SHEET_ID, {
        sheetName: 'Preferred Chain',
        range: 'A:D',
        values: [[new Date(), address, chain, pendleStaked]],
    });
