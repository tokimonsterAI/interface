import {useEffect, useState} from 'react';

const padDigit = (num: number) => num.toString().padStart(2, '0');

export const useCountdown = (endTime?: Date | string | number, intervalDuration = 1e3) => {
    const countdownEndTime = new Date(endTime || 0).getTime();

    const [timeRemaining, setTimeRemaining] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,

        daysFormatted: '--',
        hoursFormatted: '--',
        minutesFormatted: '--',
        secondsFormatted: '--',

        finished: !!endTime && countdownEndTime < Date.now()
    });

    useEffect(() => {
        if (!endTime) {
            return;
        }

        const interval = setInterval(() => {
            const now = Date.now();
            const timeDiff = countdownEndTime - now;

            if (timeDiff <= 0) {
                clearInterval(interval);

                setTimeRemaining({
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0,

                    daysFormatted: '00',
                    hoursFormatted: '00',
                    minutesFormatted: '00',
                    secondsFormatted: '00',

                    finished: true
                });

                return;
            }

            const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

            setTimeRemaining({
                days,
                hours,
                minutes,
                seconds,

                daysFormatted: padDigit(days),
                hoursFormatted: padDigit(hours),
                minutesFormatted: padDigit(minutes),
                secondsFormatted: padDigit(seconds),

                finished: false
            });
        }, intervalDuration);

        return () => clearInterval(interval);
    }, [intervalDuration, countdownEndTime, endTime]);

    return [timeRemaining];
};
