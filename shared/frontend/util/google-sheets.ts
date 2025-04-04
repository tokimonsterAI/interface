import {sheets_v4} from '@googleapis/sheets';
import fetch from 'isomorphic-fetch';

import {AppendValuesRequest} from '../types/google-sheet-middleware-types';

type Configuration = {
    baseUrl?: string
}

export type GetMetaOptions = {
    noGSheetCache?: boolean
}

export type GetValuesParams = {
    sheetName: string
    range?: string
}

export type GetValuesRequest = {
    spreadsheetId: string
    params: GetValuesParams
}

export type GetValuesOptions = {
    noGSheetCache?: boolean
}

type AppendValuesParams = {
    sheetName: string
    range: string
    values: any[][]
}

export const API_URL = '/api/data';

// super user api
export const SU_API_URL = '/su/api/data';

export const getMetaUrl = (
    spreadsheetId: string,
    {noGSheetCache}: GetMetaOptions = {}
) => `${API_URL}/${encodeURIComponent(spreadsheetId)}${noGSheetCache ? '?noGSheetCache=true' : ''}`;

export const getMetaFp = (config?: Configuration) => async (spreadsheetId: string, options?: GetMetaOptions) => {
    const {baseUrl = ''} = config || {};
    const requestUrl = `${baseUrl}${getMetaUrl(spreadsheetId, options)}`;

    const response = await fetch(requestUrl);

    if (response.status !== 200) {
        throw new Error('Unknown Error');
    }

    return response;
};

export const getValuesUrl = (
    spreadsheetId: string,
    {sheetName, range}: GetValuesParams,
    {noGSheetCache}: GetValuesOptions = {}
) => `${API_URL}/${encodeURIComponent(spreadsheetId)}/values?range=${encodeURIComponent(sheetName)}${range ? `!${encodeURIComponent(range)}` : ''}${noGSheetCache ? '&noGSheetCache=true' : ''}`;

export const getValuesFp = (config?: Configuration) => async (
    spreadsheetId: string,
    params: GetValuesParams,
    options: GetValuesOptions = {}
) => {
    const {baseUrl = ''} = config || {};
    const requestUrl = `${baseUrl}${getValuesUrl(spreadsheetId, params, options)}`;

    const response = await fetch(requestUrl);

    if (response.status !== 200) {
        throw new Error('Unknown Error');
    }

    return response;
};

type BatchGetValuesRequest = {
    requests: GetValuesRequest[]
}

export const batchGetValuesFp = (config?: Configuration) => async (
    req: BatchGetValuesRequest,
    options?: GetValuesOptions
) => {
    const requests = req.requests.map(({spreadsheetId, params}) => ({
        spreadsheetId,
        range: `${params.sheetName}${params.range ? `!${params.range}` : ''}`
    }));

    const {baseUrl = ''} = config || {};
    const requestUrl = `${baseUrl}${API_URL}/batch`;

    const response = await fetch(requestUrl, {
        method: 'POST',
        body: JSON.stringify({requests, options}),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.status !== 200) {
        throw new Error('Unknown Error');
    }

    return response;
};

export const appendValuesFp = (config?: Configuration) => async (
    spreadsheetId: string,
    {sheetName, range, values}: AppendValuesParams
) => {
    const {baseUrl = ''} = config || {};
    const requestUrl = `${baseUrl}${API_URL}/${encodeURIComponent(spreadsheetId)}/values`;

    const request: AppendValuesRequest = {
        range: `${sheetName}!${range}`,
        values
    };

    const response = await fetch(requestUrl, {
        method: 'POST',
        body: JSON.stringify(request),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.status !== 200) {
        throw new Error('Unknown Error');
    }

    return response;
};

// only for internal tools usage!!!
export const batchUpdateFp = (config?: Configuration) => async (
    spreadsheetId: string,
    request: sheets_v4.Schema$BatchUpdateSpreadsheetRequest
) => {
    const {baseUrl = ''} = config || {};
    const requestUrl = `${baseUrl}${SU_API_URL}/${encodeURIComponent(spreadsheetId)}/batchUpdate`;

    const response = await fetch(requestUrl, {
        method: 'POST',
        body: JSON.stringify(request),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.status !== 200) {
        console.log(response); // eslint-disable-line no-console

        let message = 'Unknown Error';
        try {
            const data = await response.json();
            message = data.error.message;
        } catch (e) {
            message = 'Failed to retrieve error message';
        }

        throw new Error(message);
    }

    return response;
};

// static utility functions
export const convertRowsToObjects = <T = any>(data?: string[][]) => {
    if (!data) return data;

    const [header, ...rows] = data;

    return rows.map(row => Object.fromEntries(header.map((field, idx) => [field, row[idx]])) as T);
};

export const convertRowsToConfig = <T>(data?: [string, any][]) => Object.freeze(data?.slice(0).reduce((acc: any, row: [string, any], index) => {
    const [key, value] = row;

    // ignore empty value
    if (!value || (typeof value === 'string' && value.trim().length === 0)) {
        return acc;
    }

    let parsedValue = value;
    if (typeof value === 'string') {
        try {
            parsedValue = JSON.parse(value);
        } catch (e) {
            console.error(`Failed to parse ${index} ${key}: ${value}`); // eslint-disable-line no-console
            parsedValue = undefined;

            return acc;
        }
    }

    if (acc[key] !== undefined) { // handle separated array configurations
        if (!Array.isArray(acc[key])) {
            acc[key] = [acc[key]]; // convert to array
        }

        if (Array.isArray(parsedValue)) {
            acc[key].push(...parsedValue);
        } else {
            acc[key].push(parsedValue);
        }
    } else {
        acc[key] = parsedValue;
    }

    return acc;
}, {})) as T;

export const extractSheetId = (urlOrSheetId: string): string => {
    if (urlOrSheetId.startsWith('http')) {
        const regex = /\/spreadsheets(?:\/u\/\d+)?\/d\/([^/#]+)(\/|$|#)/;
        const match = urlOrSheetId.match(regex);
        const result = match ? match[1] : urlOrSheetId;
        console.log(`[Google Sheets] extract sheetId, input=${urlOrSheetId}, output=${result}`); // eslint-disable-line no-console

        return result;
    }

    return urlOrSheetId;
};
