import {sendMessage} from './tele-bot';

type IPInfo = {
    address: string
    violationCount: number
    lastAccessTime: number
    notified?: boolean
}

const ipMap: Record<string, IPInfo> = {};
const MIN_DURATION_BEFORE_RESET = 30 * 60 * 1e3; // 30 minute
export const MAX_VIOLATION_COUNT_BEFORE_BLOCK = 20;

export const getIpMap = () => ipMap;

export const increaseViolationCount = (ip?: string, amount = 1) => {
    if (!ip) {
        console.error('[Access Control][increaseViolationCount] IP is not provided');

        return;
    }

    const ipInfo: IPInfo = ipMap[ip] ?? {
        address: ip,
        violationCount: 0,
        lastAccessTime: 0
    };

    ipInfo.violationCount += amount;
    ipInfo.lastAccessTime = Date.now();

    ipMap[ip] = ipInfo;

    console.log(`[Access Control] IP: ${ip}, violationCount: ${ipInfo.violationCount}`);
};

export const checkBlockedIp = (tag: string, ip?: string) => {
    if (!ip) {
        console.error('[Access Control][checkBlockedIp] IP is not provided');

        return false;
    }

    const ipInfo = ipMap[ip];

    if (!ipInfo) {
        return false;
    }

    if (Date.now() - ipInfo.lastAccessTime > MIN_DURATION_BEFORE_RESET) {
        unblockIP(ip, tag);

        return false;
    }

    ipInfo.lastAccessTime = Date.now(); // update last access time

    if (ipInfo.violationCount < MAX_VIOLATION_COUNT_BEFORE_BLOCK) {
        return false;
    }

    console.log(`[Access Control] Blocked IP: ${ip}`);

    if (!ipInfo.notified) {
        sendMessage(`${tag}[Access Control] Blocked IP: ${ip}`, {
            channel: 'dev',
            group: 'Access Control'
        });

        ipInfo.notified = true;
    }

    return true;
};

export const unblockIP = (ip: string, tag: string) => {
    delete ipMap[ip]; // reset

    console.log(`[Access Control] Unblocked IP: ${ip}`);
    sendMessage(`${tag}[Access Control] Unblocked IP: ${ip}`, {
        channel: 'dev',
        group: 'Access Control'
    });
};

export const isIPBlocked = (ip: string): boolean => {
    const ipInfo = ipMap[ip];

    if (!ipInfo) {
        return false;
    }

    return ipInfo.violationCount >= MAX_VIOLATION_COUNT_BEFORE_BLOCK;
};
