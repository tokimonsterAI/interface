import createDebug from 'debug';

export const getLogger = (label: string) => createDebug(`Tokimonster:${label}`);
