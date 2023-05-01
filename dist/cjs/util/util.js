"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStackAbbr = exports.parseNum = exports.extractKeys = exports.sleep = void 0;
const game_interface_js_1 = require("../models/game.interface.js");
/** Waits a specified number of `ms`. */
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
exports.sleep = sleep;
function extractKeys(keysObj) {
    return Object.keys(keysObj);
}
exports.extractKeys = extractKeys;
/**
 * Parses a numerical value from a string or DOM Node, returning said value or `NaN`.
 *
 * Prior to parsing, strings are trimmed and occurrences of `,`, `%`, and `\s.+` are removed.
 *
 * @example
 * parseNum("5,001.5% (25.99%)") // 5001.5
 */
function parseNum(input) {
    const inputAsNonNull = input ?? '';
    const inputAsString = typeof inputAsNonNull === 'string' ? inputAsNonNull : inputAsNonNull.textContent ?? '';
    const inputAsParsable = inputAsString.trim().replaceAll(/%|,|\s.+/g, '');
    return +inputAsParsable;
}
exports.parseNum = parseNum;
function getStackAbbr(fullRegionName) {
    for (const [key, value] of Object.entries(game_interface_js_1.StackLookup)) {
        if (value === fullRegionName) {
            return key;
        }
    }
    return null;
}
exports.getStackAbbr = getStackAbbr;
//# sourceMappingURL=util.js.map