import type { TrophyGroup } from '../../models/trophy.interface.js';
import { Select } from '../../util/psnp/select.js';
import { PsnpParser } from '../psnpParser.js';
import { TrophyParser } from './trophy.js';

export class TrophyGroupsParser extends PsnpParser<TrophyGroup[], Document> {
	protected readonly expectedEntityType = 'Trophy Group';

	protected _parse(doc: Document): TrophyGroup[] {
		const groups = this.getTrophyGroups(doc)
			.map(groupNode => {
				const trophyTable = this.trophyGroupTrophyTable(groupNode);
				const groupHeader = groupNode.previousElementSibling;
				const groupName = this.trophyGroupName(groupNode);

				if (!trophyTable || !groupHeader || !groupName) {
					return null;
				}

				const match = groupHeader.id.match(/^DLC-(\d+)$/);
				const groupNum = match ? Number.parseInt(match[1] ?? '', 10) : 0;

				const trophyParser = new TrophyParser();
				const trophies = Select.tr(trophyTable).map(tr => trophyParser.parse(tr));

				return {
					groupNum,
					name: groupName,
					trophies,
				};
			})
			.filter(group => group !== null) as TrophyGroup[];

		return groups;
	}

	/** Returns an array of nodes representing the trophy list's trophy groups. */
	protected getTrophyGroups(doc: Document) {
		return [...doc.querySelectorAll<HTMLDivElement>(`#content div.col-xs > div.box.no-top-border`)];
	}

	/** Given a trophy group node, returns the name of the group. */
	protected trophyGroupName(trophyGroup: HTMLDivElement): string {
		const nameHolder = trophyGroup.querySelector<HTMLSpanElement>(`table tr > td > span.title`);
		return nameHolder?.textContent?.trim() ?? 'Base Game';
	}

	/** Given a trophy group node, returns the `HTMLTableElement` containing the group's trophy nodes. */
	protected trophyGroupTrophyTable(trophyGroup: HTMLDivElement) {
		return trophyGroup.querySelector<HTMLTableElement>(`table:last-of-type`);
	}
}
