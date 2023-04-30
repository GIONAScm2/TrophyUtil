"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParserTrophyGroups = void 0;
const index_js_1 = require("../../index.js");
const psnpParser_js_1 = require("../psnpParser.js");
const trophy_js_1 = require("./trophy.js");
class ParserTrophyGroups extends psnpParser_js_1.PsnpParser {
    type = 'Trophy Group';
    _parse(doc) {
        const groups = this.getTrophyGroups(doc)
            .map(groupNode => {
            const trophyTable = this.trophyGroupTrophyTable(groupNode);
            const groupHeader = groupNode.previousElementSibling;
            const groupName = this.trophyGroupName(groupNode);
            if (!trophyTable || !groupHeader || !groupName) {
                return null;
            }
            const match = groupHeader.id.match(/^DLC-(\d+)$/);
            const groupNum = match ? +match[1] : 0;
            const trophyParser = new trophy_js_1.ParserTrophy();
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
    /** Returns an array of nodes representing the trophy list's trophy groups. */
    getTrophyGroups(doc) {
        return [...doc.querySelectorAll(`#content div.col-xs > div.box.no-top-border`)];
    }
    /** Given a trophy group node, returns the name of the group. */
    trophyGroupName(trophyGroup) {
        const nameHolder = trophyGroup.querySelector(`table tr > td > span.title`);
        return nameHolder?.textContent?.trim() ?? 'Base Game';
    }
    /** Given a trophy group node, returns the `HTMLTableElement` containing the group's trophy nodes. */
    trophyGroupTrophyTable(trophyGroup) {
        return trophyGroup.querySelector(`table:last-of-type`);
    }
}
exports.ParserTrophyGroups = ParserTrophyGroups;
//# sourceMappingURL=trophyGroups.js.map