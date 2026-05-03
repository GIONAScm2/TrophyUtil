import { PsnpParser } from '../psnpParser.js';
import type { GameDlc } from '../../models/game.interface.js';
import { calculateTrophyPoints, sumTrophyCount } from '../../models/common.js';
import { parseTrophyCount } from '../common/trophyCount.js';
import { parsePlatformTags } from '../../util/util.js';

export class DlcListingParser extends PsnpParser<GameDlc, HTMLTableRowElement> {
	protected readonly expectedEntityType = 'DLC Listing';

	protected _parse(tr: HTMLTableRowElement): GameDlc | null {
		const titleAnchorEl = tr.querySelector(`td a.title`);
		const href = titleAnchorEl?.getAttribute('href');
		const hrefIdAndTitle = this._extractIdAndTitleFromPsnpUrl({ url: href });
		const imageSrc = tr.querySelector('img[src]')?.getAttribute('src');

		if (!titleAnchorEl?.textContent || !hrefIdAndTitle || !imageSrc) {
			return null;
		}

		const [id, rawSlug] = hrefIdAndTitle;
		const name = titleAnchorEl?.lastChild?.textContent?.trim();
		const dlcName = titleAnchorEl?.firstChild?.textContent?.trim();
		const groupNumMatch = rawSlug.match(/DLC-(\d+)/);

		const imagePath = /\w+\/\w+(?=\.[A-z]{3}$)/.exec(imageSrc)?.at(0);
		const platforms = parsePlatformTags(tr);

		if (!imagePath || !name || !dlcName || !platforms.length || !groupNumMatch) {
			if (!imagePath)
				this.addIssue({ field: 'imagePath', selector: 'img[src]', message: 'Unable to extract image path' });
			if (!name) this.addIssue({ field: 'name', message: 'Missing parent game name' });
			if (!dlcName) this.addIssue({ field: 'dlcName', message: 'Missing DLC name' });
			if (!platforms.length)
				this.addIssue({ field: 'platforms', selector: 'span.tag.platform', message: 'Missing platform tags' });
			if (!groupNumMatch) this.addIssue({ field: 'groupNum', message: 'Unable to extract DLC group number' });
			return null;
		}

		const groupNum = Number.parseInt(groupNumMatch[1] ?? '', 10);

		const trophyCount = parseTrophyCount(tr, true);
		if (!trophyCount) {
			return null;
		}
		const numTrophies = sumTrophyCount(trophyCount);
		const points = calculateTrophyPoints(trophyCount);

		return {
			id,
			slug: rawSlug.replace(/#DLC.+/, ''),
			name,
			imagePath,
			dlcName,
			groupNum,
			platforms,
			trophyCount,
			numTrophies,
			points,
		};
	}
}
