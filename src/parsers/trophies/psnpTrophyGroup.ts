import {ITrophyGroup, Select} from '../../index.js';
import {PsnpParser} from '../psnpParser.js';
import {PsnpTrophyParser} from './psnpTrophy.js';

export class PsnpTrophyGroupsParser extends PsnpParser<ITrophyGroup[], Document> {
	protected readonly type = 'Trophy Group';
	trophyGroupNodes: HTMLDivElement[];

	constructor(public doc: Document) {
		super();
		this.trophyGroupNodes = this.getTrophyGroups();
	}

	protected _parse(): ITrophyGroup[] {
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
			.filter(group => group !== null) as ITrophyGroup[];

		return groups;
	}

	/** Returns an array of nodes representing the trophy list's trophy groups. */
	getTrophyGroups() {
		return [...this.doc.querySelectorAll<HTMLDivElement>(`#content div.col-xs > div.box.no-top-border`)];
	}

	/** Given a trophy group node, returns the name of the group. */
	trophyGroupName(trophyGroup: HTMLDivElement): 'Base Game' | string {
		const nameHolder = trophyGroup.querySelector<HTMLSpanElement>(`table tr > td > span.title`);
		return nameHolder?.textContent?.trim() ?? 'Base Game';
	}

	/** Given a trophy group node, returns the `HTMLTableElement` containing the group's trophy nodes. */
	trophyGroupTrophyTable(trophyGroup: HTMLDivElement) {
		return trophyGroup.querySelector<HTMLTableElement>(`table:last-of-type`);
	}
}
