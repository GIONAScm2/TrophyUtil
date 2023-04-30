import { Select } from '../../index.js';
import { PsnpParser } from '../psnpParser.js';
import { PsnpTrophyParser } from './psnpTrophy.js';
export class PsnpTrophyGroupsParser extends PsnpParser {
    doc;
    type = 'Trophy Group';
    trophyGroupNodes;
    constructor(doc) {
        super();
        this.doc = doc;
        this.trophyGroupNodes = this.getTrophyGroups();
    }
    _parse() {
        const groups = this.getTrophyGroups()
            .map(groupNode => {
            const trophyTable = this.trophyGroupTrophyTable(groupNode);
            const groupHeader = groupNode.previousElementSibling;
            const groupName = this.trophyGroupName(groupNode);
            if (!trophyTable || !groupHeader || !groupName) {
                return null;
            }
            const match = groupHeader.id.match(/^DLC-(\d+)$/);
            const groupNum = match ? +match[1] : 0;
            const trophyParser = new PsnpTrophyParser();
            const trophies = Select.tr(trophyTable).map(tr => trophyParser.parse(tr));
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
    getTrophyGroups() {
        return [...this.doc.querySelectorAll(`#content div.col-xs > div.box.no-top-border`)];
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
//# sourceMappingURL=psnpTrophyGroup.js.map