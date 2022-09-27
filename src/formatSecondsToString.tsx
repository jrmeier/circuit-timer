export function formatMSToDisplay (ms: number) {
    const secondsInt = Math.floor(ms / 1000)
    let minutesInt = Math.floor(secondsInt / 60);
    const displaySeconds = secondsInt % 60;

    const addLeadingZero = (num: number, fixed=0) => num < 10 ? `0${num}` : num

    return addLeadingZero(minutesInt) + ":" + addLeadingZero(displaySeconds, 2) + ":" + addLeadingZero(ms % 1000, 3)
}
