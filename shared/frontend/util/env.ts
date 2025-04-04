export const isInNode = typeof process !== 'undefined' && process.versions && process.versions.node;
export const isInBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

export const isHostnameMatched = (targetHostnames: string[], hostname?: string) => {
    if (!isInBrowser && !hostname) {
        return false;
    }

    if (!hostname && typeof window == 'undefined') {
        throw new Error('window object not found!');
    }

    const hostnameToCheck = hostname || window.location.hostname;

    return targetHostnames.some((targetHostname: string) => hostnameToCheck.startsWith(targetHostname));
};
