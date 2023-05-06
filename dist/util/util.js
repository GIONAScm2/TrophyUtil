import { StackLookup } from '../models/game.interface.js';
/** Waits a specified number of `ms`. */
export async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export function extractKeys(keysObj) {
    return Object.keys(keysObj);
}
/**
 * Parses a numerical value from a string or DOM Node, returning said value or `NaN`.
 *
 * Prior to parsing, strings are trimmed and occurrences of `,`, `%`, and `\s.+` are removed.
 *
 * @example
 * parseNum("5,001.5% (25.99%)") // 5001.5
 */
export function parseNum(input) {
    const inputAsNonNull = input ?? '';
    const inputAsString = typeof inputAsNonNull === 'string' ? inputAsNonNull : inputAsNonNull.textContent ?? '';
    const inputAsParsable = inputAsString.trim().replaceAll(/%|,|\s.+/g, '');
    if (inputAsParsable === '')
        return Number.NaN;
    return +inputAsParsable;
}
export function getStackAbbr(fullRegionName) {
    for (const [key, value] of Object.entries(StackLookup)) {
        if (value === fullRegionName) {
            return key;
        }
    }
    return null;
}
//# sourceMappingURL=util.js.map