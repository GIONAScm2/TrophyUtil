"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PsnpTrophyGroupParser = void 0;
const index_js_1 = require("../../index.js");
const psnpParser_js_1 = require("../psnpParser.js");
const psnpTrophy_js_1 = require("./psnpTrophy.js");
class PsnpTrophyGroupParser extends psnpParser_js_1.PsnpParser {
    type = 'Trophy Group';
    _parse(doc) {
        const groups = index_js_1.Select.trophyGroups(doc)
            .map(group => {
            const trophyTable = index_js_1.Select.trophyGroupTrophyTable(group);
            const groupHeader = group.previousElementSibling;
            const groupName = index_js_1.Select.trophyGroupName(group)?.textContent?.trim() ?? 'Base Game';
            if (!trophyTable || !groupHeader || !groupName) {
                return null;
            }
            const match = groupHeader.id.match(/^DLC-(\d+)$/);
            const groupNum = match ? +match[1] : 0;
            const trophyParser = new psnpTrophy_js_1.PsnpTrophyParser();
            const trophies = index_js_1.Select.tr(trophyTable).map(tr => trophyParser.parse(tr));
            return {
                groupNum,
                name: groupName,
                trophies,
            };
        })
            .filter(group => group !== null);
        return groups;
    }
}
exports.PsnpTrophyGroupParser = PsnpTrophyGroupParser;
//# sourceMappingURL=psnpTrophyGroup.js.map