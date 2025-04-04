const hourMs = 60 * 60 * 1e3;

export default function timeTag(targetTimezoneOffset = 8) {
    function getTimeTag() {
        const timestamps = Date.now() + targetTimezoneOffset * hourMs;
        const date = new Date(timestamps);

        return `[${date.toISOString().replace('T', ' ')}]`;
    }

    const methods: Array<keyof Console> = ['log', 'error'];
    methods.forEach(method => {
        const originalMethodName = `original${method}`;
        const customLogger = console as any;
        customLogger[originalMethodName] = console[method];
        customLogger[method] = (...args: any[]) => customLogger[originalMethodName](getTimeTag(), ...args);
    });
}
