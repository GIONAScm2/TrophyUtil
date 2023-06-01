"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTrophyCount = void 0;
const util_1 = require("../../util/util");
function parseTrophyCount(tr, isHomeOrGameSearch = false) {
    const suffix = isHomeOrGameSearch ? '.icon-sprite' : '.icon-sprite + span';
    const bronze = (0, util_1.parseNum)(tr.querySelector(`.bronze${suffix}`));
    const silver = (0, util_1.parseNum)(tr.querySelector(`.silver${suffix}`));
    const gold = (0, util_1.parseNum)(tr.querySelector(`.gold${suffix}`));
    if (Number.isNaN(bronze + silver + gold)) {
        return null;
    }
    let platCount = 0;
    const platNode = tr.querySelector('[class*="platinum"]');
    if (platNode) {
        // Profile/Series
        if (tr.querySelector('.platinum-18')) {
            platCount = tr.querySelector('.platinum-18.earned') ? 1 : 0;
        }
        // Standard
        else
            platCount = (0, util_1.parseNum)(tr.querySelector(`.platinum${suffix}`));
    }
    // const platCount = parseNum(tr.querySelector());
    platCount = Number.isNaN(platCount) ? 0 : platCount;
    return { bronze, silver, gold, platinum: platCount };
}
exports.parseTrophyCount = parseTrophyCount;
//# sourceMappingURL=trophyCount.js.map