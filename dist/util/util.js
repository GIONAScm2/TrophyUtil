import { StackLookup } from '../models/game.interface.js';
/** Waits a specified number of `ms`. */
export async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export function extractKeys(keysObj) {
    return Object.keys(keysObj);
}
/** Parses a number from a string or DOM Node, taking care of trimming strings and parsing comma and percent characters. */
export function parseNum(input) {
    const narrowedInput = input ?? '';
    const text = typeof narrowedInput === 'string' ? narrowedInput : narrowedInput.textContent ?? '';
    const cleanText = text.trim().replaceAll(/%|,/g, '');
    return +cleanText;
}
export function getAbbreviation(regionName) {
    for (const [key, value] of Object.entries(StackLookup)) {
        if (value === regionName) {
            return key;
        }
    }
    return null;
}
//# sourceMappingURL=util.js.map