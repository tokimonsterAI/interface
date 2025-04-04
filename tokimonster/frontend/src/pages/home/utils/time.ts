export function timeAgo(timestampMs?: number): string {
    if (!timestampMs) return '';
    const now = new Date();
    const inputTime = new Date(timestampMs);

    const deltaSeconds = Math.floor((now.getTime() - inputTime.getTime()) / 1000);

    const years = Math.floor(deltaSeconds / (365 * 24 * 60 * 60));
    const months = Math.floor(deltaSeconds / (30 * 24 * 60 * 60));
    const days = Math.floor(deltaSeconds / (24 * 60 * 60));
    const hours = Math.floor(deltaSeconds / (60 * 60));
    const minutes = Math.floor(deltaSeconds / 60);

    if (years >= 1) {
        return `${years} year${years > 1 ? 's' : ''} ago`;
    } else if (months >= 1) {
        return `${months} month${months > 1 ? 's' : ''} ago`;
    } else if (days >= 1) {
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours >= 1) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes >= 1) {
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
        return `${deltaSeconds} second${deltaSeconds > 1 ? 's' : ''} ago`;
    }
}
