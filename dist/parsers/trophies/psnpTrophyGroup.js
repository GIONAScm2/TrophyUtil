import { Select } from '../../index.js';
import { PsnpParser } from '../PsnpParser.js';
import { PsnpTrophyParser } from './psnpTrophy.js';
export class PsnpTrophyGroupParser extends PsnpParser {
    type = 'Trophy Group';
    _parse(doc) {
        const groups = Select.trophyGroups(doc)
            .map(group => {
            const trophyTable = Select.trophyGroupTrophyTable(group);
            const groupHeader = group.previousElementSibling;
            const groupName = Select.trophyGroupName(group)?.textContent?.trim() ?? 'Base Game';
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
}
//# sourceMappingURL=psnpTrophyGroup.js.map