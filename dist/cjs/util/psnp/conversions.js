"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timestampFromDatePlayed = exports.speedStringToMs = exports.msToSpeedString = void 0;
/** Converts `ms` into a PSNP speedString of the form `<num> <timeMetric>(s), <num> <timeMetric>(s)`.
 *  The largest metrics are always used (EG: `2 years, 1 month`, even if it omits an additional 3 weeks). */
function msToSpeedString(ms) {
    if (ms === 0) {
        return '0 seconds';
    }
    let seconds = ms / 1000;
    const timeUnits = [
        { unit: 'year', value: 31536000 },
        { unit: 'month', value: 2626560 },
        { unit: 'week', value: 604800 },
        { unit: 'day', value: 86400 },
        { unit: 'hour', value: 3600 },
        { unit: 'minute', value: 60 },
        { unit: 'second', value: 1 },
    ];
    let speedString = '';
    let countUnits = 0;
    for (const { unit, value } of timeUnits) {
        if (seconds >= value) {
            const count = Math.floor(seconds / value);
            seconds -= value * count;
            speedString += `${count} ${unit}${count > 1 ? 's' : ''}`;
            countUnits++;
            if (countUnits === 2) {
                break;
            }
            if (seconds > 0) {
                speedString += ', ';
            }
        }
    }
    return speedString;
}
exports.msToSpeedString = msToSpeedString;
/** Parses a Fastest Achiever's speed into ms. `speedString` is always of the form `<num> <timeMetric>(s), <num> <timeMetric>(s)`. */
function speedStringToMs(speedString) {
    const timeUnits = {
        sec: 1,
        min: 60,
        hou: 3600,
        day: 86400,
        wee: 604800,
        mon: 2626560,
        yea: 31536000,
    };
    const speeds = speedString.split(', ');
    let seconds = 0;
    for (const speed of speeds) {
        const [time, timeMetric] = speed.split(' ');
        const timeValue = parseInt(time, 10);
        const timeUnit = timeMetric.substring(0, 3);
        seconds += timeUnits[timeUnit] * timeValue;
    }
    return seconds * 1000;
}
exports.speedStringToMs = speedStringToMs;
/** Takes in a 'date played' element: \<div class="small-info" [...] */
function timestampFromDatePlayed(element) {
    const textContent = element.textContent;
    if (!textContent) {
        return null;
    }
    const [dateText] = textContent.split('•').map(s => s.trim());
    if (!dateText) {
        throw new Error(`Unable to parse Date Played "${textContent}" into a timestamp`);
    }
    const cleanedDateText = dateText.replace(/(\d+)(st|nd|rd|th)/, '$1').trim();
    return new Date(cleanedDateText).valueOf();
}
exports.timestampFromDatePlayed = timestampFromDatePlayed;
//# sourceMappingURL=conversions.js.map