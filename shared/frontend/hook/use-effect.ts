import {useEffect, useRef} from 'react';

// wait until the effect callback becomes stable
export const useDelayedEffect = (effect: React.EffectCallback, delay = 50) => {
    const timerId = useRef<any | undefined>(undefined);

    useEffect(() => {
        if (timerId.current) {
            clearTimeout(timerId.current);
        }

        timerId.current = setTimeout(effect, delay);

        return () => {
            if (timerId.current) {
                clearTimeout(timerId.current);
            }
        };
    }, [delay, effect]);
};
