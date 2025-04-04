import fetch from 'isomorphic-fetch';

import {parseBigNumber} from './local-cache';

export const fetchJson = async <T = any>(url: string, init?: RequestInit) => {
    const res = await fetch(url, init);

    try {
        const json = await res.json();

        return parseBigNumber(json) as T;
    } catch (e) {
        throw new Error(`Request failed: ${res.status} ${res.text}`);
    }
};

export const fetchJsonData = async <T = any>(url: string) => {
    const res = await fetchJson(url);

    if (!res?.data) {
        throw new Error('empty response');
    }

    return res.data as T;
};
