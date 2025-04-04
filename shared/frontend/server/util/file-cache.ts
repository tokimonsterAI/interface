import fs from 'fs';
import path from 'path';

import {parseBigNumber} from '../../util/local-cache';

export const CHAIN_INFO_CACHE_FILE_PATH = process.env.CHAIN_INFO_CACHE_FILE_PATH ?? `${process.cwd()}/build/chain-info-cache.json`;

export const getCacheFilePath = (basename: string) => {
    return path.resolve(path.dirname(CHAIN_INFO_CACHE_FILE_PATH), basename);
};

const getTagFromFilePath = (filePath: string) => {
    return filePath && path.basename(filePath, path.extname(filePath));
};

export const loadFileCache = (filePath?: string, {enableBigNumberParsing}: {enableBigNumberParsing?: boolean} = {}) => {
    if (!filePath) {
        return;
    }

    try {
        const fileCache = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        return enableBigNumberParsing ? parseBigNumber(fileCache) : fileCache;
    } catch (e) {
        console.error(`[${getTagFromFilePath(filePath)}] failed to load file cache`, e);
    }
};

export const writeFileCache = (filePath?: string, cache?: any) => {
    if (!filePath) {
        return;
    }

    try {
        fs.writeFileSync(filePath, JSON.stringify(cache));
    } catch (e) {
        console.error(`[${getTagFromFilePath(filePath)}] failed to write file cache`, e);
    }
};
