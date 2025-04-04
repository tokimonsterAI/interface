import {auth as gAuth, sheets as gSheets} from '@googleapis/sheets';
import {Application} from 'express';

import {AppendValuesRequest} from '../../types/google-sheet-middleware-types';
import {API_URL, extractSheetId, SU_API_URL} from '../../util/google-sheets';
import {MAX_VIOLATION_COUNT_BEFORE_BLOCK, increaseViolationCount} from '../util/access-control';
import {createRefreshQueue} from '../util/refresh-queue';
import {sendMessage} from '../util/tele-bot';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const FILE_CACHE_PATH = process.env.GOOGLE_SHEETS_CACHE_FILE_PATH;
const META_CACHE_PATH = process.env.GOOGLE_SHEETS_META_CACHE_FILE_PATH;

// ${spreadsheetId}-${range} => values
type RefreshQueueRequest = {
    spreadsheetId: string
    range: any
}

// ref to https://developers.google.com/sheets/api/limits
const refreshDuration = 30e3; // 30s
const refreshInterval = 2e3; // 2s
const refreshMaxWaitTime = 120e3; // 120s
const getCacheKey = (req: RefreshQueueRequest) => `${req.spreadsheetId}-${req.range}`;

type Options = {
    serviceName?: string
    enableSuperApi?: boolean
}

/**
 * Service Account:
 * testnet: g-sheets@molten-acumen-388503.iam.gserviceaccount.com
 * prod: g-sheets-prod@molten-acumen-388503.iam.gserviceaccount.com
 * https://console.cloud.google.com/iam-admin/serviceaccounts/details/115225694748777133608
 * 
 * References:
 * https://github.com/googleapis/google-api-nodejs-client#google-apis-nodejs-client
 * https://hackernoon.com/how-to-use-google-sheets-api-with-nodejs-cz3v316f
 */
export function mountGoogleSheets(
    app: Application,
    {
        serviceName,
        enableSuperApi = false
    }: Options = {}
) {
    const msgTag = `[${serviceName}]`;
    const sendAlertMessage = (msg: string, err?: any) => sendMessage(`${msgTag}${msg}${err?.message ? ` ${err.message}` : ''}`, {
        channel: 'alert',
        group: 'Google Sheets'
    });

    const auth = new gAuth.GoogleAuth({
        scopes: SCOPES
    });

    const {spreadsheets} = gSheets({version: 'v4', auth});

    const {
        getCacheData,
        forceRefreshCacheData,

        batchForceRefreshCacheData,
        batchGetCacheOrFetchData,

        getQueueStatus
    } = createRefreshQueue({
        fetch: (req: {spreadsheetId: string; range: any}) => spreadsheets.values.get(req).then(res => {
            const result = {status: res.status, data: res.data};
            if (res.status === 200) {
                return result;
            }

            return Promise.reject(result);
        }),

        fileCachePath: FILE_CACHE_PATH,
        getCacheKey: getCacheKey,

        refreshDuration,
        refreshInterval,
        refreshMaxWaitTime,

        logTag: '[Google Sheets]'
    });

    const {
        getCacheData: getMetaCacheData,
        forceRefreshCacheData: forceRefreshMetaCacheData,
        getQueueStatus: getMetaQueueStatus
    } = createRefreshQueue({
        fetch: (req: {spreadsheetId: string}) => spreadsheets.get(req).then(res => {
            const result = {status: res.status, data: res.data};
            if (res.status === 200) {
                return result;
            }

            return Promise.reject(result);
        }),

        fileCachePath: META_CACHE_PATH,
        getCacheKey: (req: {spreadsheetId: string}) => req.spreadsheetId,

        refreshDuration,
        refreshInterval,
        refreshMaxWaitTime,

        logTag: '[Google Sheets][Meta]'
    });

    // read sheet metadata
    app.get(`${API_URL}/:spreadsheetId`, (req, res) => {
        const {spreadsheetId: rawSheetId} = req.params;
        const spreadsheetId = extractSheetId(rawSheetId);

        const {noGSheetCache} = req.query;
        const cacheFirst = !noGSheetCache;

        const cachedResponse = getMetaCacheData({spreadsheetId});
        if (cacheFirst && cachedResponse?.status) {
            console.log('[Google Sheets][Meta] reading meta from cache:', spreadsheetId);
            res.status(cachedResponse.status).json(cachedResponse.data);

            return;
        }

        forceRefreshMetaCacheData({spreadsheetId})
            .then(() => {
                const newlyCachedResponse = getMetaCacheData({spreadsheetId});
                if (newlyCachedResponse) {
                    console.log('[Google Sheets][Meta] reading meta from new cache:', spreadsheetId);
                    res.status(newlyCachedResponse.status).json(newlyCachedResponse.data);
                } else {
                    const msg = `[Google Sheets][Meta] ${req.ip} reading meta from new cache error: not found, sheetId=${spreadsheetId}`;
                    console.error(msg);
                    sendAlertMessage(msg);

                    res.status(500).json({error: 'Unknown error.'});
                }
            })
            .catch(error => {
                const msg = `[Google Sheets][Meta] ${req.ip} error: sheetId=${spreadsheetId}`;
                console.error(msg);
                console.error(error);
                sendAlertMessage(msg, error);

                res.status(error.code || 500).json(error?.response?.data || {error: 'Unknown error.'});

                increaseViolationCount(req.ip);
            });
    });

    // read sheet values
    app.get(`${API_URL}/:spreadsheetId/values`, (req, res) => {
        const {spreadsheetId: rawSheetId} = req.params;
        const spreadsheetId = extractSheetId(rawSheetId);

        const {range, noGSheetCache} = req.query;
        const cacheFirst = !noGSheetCache;

        const cachedResponse = getCacheData({spreadsheetId, range});
        if (cacheFirst && cachedResponse?.status) {
            console.log('[Google Sheets] reading values from cache:', spreadsheetId, range);
            res.status(cachedResponse.status).json(cachedResponse.data);

            return;
        }

        // else fetch immediately, and delay the refresh queue
        forceRefreshCacheData({spreadsheetId, range})
            .then(() => {
                const newlyCachedResponse = getCacheData({spreadsheetId, range});
                if (newlyCachedResponse) {
                    // refreshed values will be saved to cache
                    console.log('[Google Sheets] reading values from new cache:', spreadsheetId, range);
                    res.status(newlyCachedResponse.status).json(newlyCachedResponse.data);
                } else {
                    // refresh failed
                    const msg = `[Google Sheets] ${req.ip} reading values from new cache error: not found, sheetId=${spreadsheetId}, range=${range}`;
                    console.error(msg);
                    sendAlertMessage(msg);

                    res.status(500).json({error: 'Unknown error.'});
                }
            })
            .catch((error: any) => {
                const status = error?.response?.status;
                const msg = `[Google Sheets] ${req.ip} reading values from new cache error: status=${status}, sheetId=${spreadsheetId}, range=${range}`;
                console.error(msg);
                console.error(error);
                sendAlertMessage(msg, error);

                res.status(500).json({error: 'Unknown error.'});

                increaseViolationCount(req.ip);
            });
    });

    // batch get sheets values
    app.post(`${API_URL}/batch`, (req, res) => {
        const {requests: rawRequests = [], options = {}} = req.body || {};
        const requests: RefreshQueueRequest[] = rawRequests.map((req: any) => ({
            ...req,
            spreadsheetId: extractSheetId(req.spreadsheetId)
        }));

        console.log('[Google Sheets] batch get values:', requests);

        const method = options.noGSheetCache ? batchForceRefreshCacheData : batchGetCacheOrFetchData;

        method(requests)
            .then(responses => {
                console.log('[Google Sheets] batch get values succeeded:', requests);
                res.json({responses});
            })
            .catch(error => {
                const msg = `[Google Sheets] ${req.ip} batch get values error, requests number: ${requests.length}`;
                console.error(msg, requests);
                console.error(error);
                sendAlertMessage(msg, error);

                res.status(500).json({error: 'Unknown error.'});

                increaseViolationCount(req.ip);
            });
    });

    // append rows
    app.post(`${API_URL}/:spreadsheetId/values`, (req, res) => {
        const {spreadsheetId: rawSheetId} = req.params;
        const spreadsheetId = extractSheetId(rawSheetId);
        console.log('[Google Sheets] appending values:', spreadsheetId);

        const {range, values} = (req.body || {}) as AppendValuesRequest;

        spreadsheets.values
            .append({
                spreadsheetId,
                range,
                valueInputOption: 'RAW',
                insertDataOption: 'INSERT_ROWS',
                requestBody: {
                    values
                }
            })
            .then(response => {
                console.log('[Google Sheets] appending values succeeded:', spreadsheetId);
                res.status(response.status).json(response.data);
            })
            .catch(error => {
                const msg = `[Google Sheets] ${req.ip} appending values error: sheetId=${spreadsheetId}, range=${range}`;
                console.error(msg, req);
                console.error(error);
                sendAlertMessage(msg, error);

                res.status(error.code || 500).json(error?.response?.data || {error: 'Unknown error.'});

                increaseViolationCount(req.ip, MAX_VIOLATION_COUNT_BEFORE_BLOCK); // directly block the IP
            });
    });

    app.get('/api/restricted/data/status', (req, res) => res.json(getQueueStatus()));
    app.get('/api/restricted/data/meta-status', (req, res) => res.json(getMetaQueueStatus()));

    if (!enableSuperApi) {
        return;
    }

    // IMPORTANT NOTE:
    // batch update, very dangerous action, should limit usage only in test/next env,
    // if this endpoint is exposed, hackers can easily wipe out all data or add any malicious data
    app.post(`${SU_API_URL}/:spreadsheetId/batchUpdate`, (req, res) => {
        const {spreadsheetId: rawSheetId} = req.params;
        const spreadsheetId = extractSheetId(rawSheetId);
        console.log('[Google Sheets] batchUpdate:', spreadsheetId);

        spreadsheets
            .batchUpdate({
                spreadsheetId,
                requestBody: req.body
            })
            .then(response => {
                console.log('[Google Sheets] batchUpdate succeeded:', spreadsheetId);
                res.status(response.status).json(response.data);
            })
            .catch(error => {
                const msg = `[Google Sheets] ${req.ip} batchUpdate error: sheetId=${spreadsheetId}`;
                console.error(msg, req);
                console.error(error);
                sendAlertMessage(msg, error);

                res.status(error.code || 500).json(error?.response?.data || {error: 'Unknown error.'});

                increaseViolationCount(req.ip);
            });
    });
}
