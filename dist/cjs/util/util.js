"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAbbreviation = exports.parseNum = exports.extractKeys = exports.sleep = void 0;
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
/** Parses a numerical value from a string or DOM Node, returning said value or `NaN`.
 * Prior to parsing, strings are trimmed and occurrences of `,` and `%` are removed. */
function parseNum(input) {
    const narrowedInput = input ?? '';
    const text = typeof narrowedInput === 'string' ? narrowedInput : narrowedInput.textContent ?? '';
    const cleanText = text.trim().replaceAll(/%|,/g, '');
    return +cleanText;
}
exports.parseNum = parseNum;
function getAbbreviation(regionName) {
    for (const [key, value] of Object.entries(game_interface_js_1.StackLookup)) {
        if (value === regionName) {
            return key;
        }
    }
    return null;
}
exports.getAbbreviation = getAbbreviation;
//# sourceMappingURL=util.js.map