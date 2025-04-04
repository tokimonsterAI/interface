import isMobileUA from 'is-mobile';

const userAgent = navigator.userAgent.toLowerCase();

export const isMobileSimple = /mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);

export const isMobile = isMobileUA();
