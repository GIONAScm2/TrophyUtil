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
/** Parses a number from a string or DOM Node, taking care of trimming strings and parsing comma and percent characters. */
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