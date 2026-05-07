import { PsnpParser } from '../psnpParser.js';
import { calculateTrophyPoints, sumTrophyCount } from '../../models/common.js';
import type { GameListing } from '../../models/game.interface.js';
import { isStackAbbr, parseNumber, parsePlatformTags } from '../../util/util.js';
import { parseTrophyCount } from '../common/trophyCount.js';

/** Parses a game listing from Games and GameSearch pages. */
export class GameListingParser extends PsnpParser<GameListing, HTMLTableRowElement> {
	protected readonly expectedEntityType = 'Game Listing';

	protected _parse(tr: HTMLTableRowElement): GameListing | null {
		const isSearchResult = !!tr.querySelector(`td:nth-of-type(5) > span.separator.left > span.typo-top`);

		const titleAnchorEl = tr.querySelector(`a.title`);
		const href = titleAnchorEl?.getAttribute('href');
		const hrefIdAndTitle = this._extractIdAndTitleFromPsnpUrl({ url: href });
		const imageSrc = tr.querySelector('img[src]')?.getAttribute('src');

		if (!titleAnchorEl?.textContent)
			this.addIssue({ field: 'name', selector: 'a.title', message: 'Missing game title' });
		if (!hrefIdAndTitle)
			this.addIssue({ field: 'url', selector: 'a.title[href]', message: 'Missing or invalid game URL' });
		if (!imageSrc) this.addIssue({ field: 'imagePath', selector: 'img[src]', message: 'Missing game image' });
		if (this.hasIssues()) {
			return null;
		}
		if (!titleAnchorEl?.textContent || !hrefIdAndTitle || !imageSrc) {
			return null;
		}

		const imagePath = /\w+\/\w+(?=\.[A-z]{3}$)/.exec(imageSrc)?.at(0);
		const name = titleAnchorEl.textContent.trim();
		const platforms = parsePlatformTags(tr);
		const trophyCount = parseTrophyCount(tr, isSearchResult);
		const numOwners = parseNumOwners(tr, isSearchResult);

		if (!imagePath)
			this.addIssue({ field: 'imagePath', selector: 'img[src]', message: 'Unable to extract image path' });
		if (!name) this.addIssue({ field: 'name', selector: 'a.title', message: 'Missing game title text' });
		if (!platforms.length)
			this.addIssue({ field: 'platforms', selector: 'span.tag.platform', message: 'Missing platform tags' });
		if (!trophyCount) this.addIssue({ field: 'trophyCount', message: 'Unable to parse trophy count' });
		if (numOwners === null) this.addIssue({ field: 'numOwners', message: 'Unable to parse owner count' });
		if (this.hasIssues() || !imagePath || !trophyCount || numOwners === null) {
			return null;
		}

		const [id, slug] = hrefIdAndTitle;
		const stackLabelText = titleAnchorEl.parentElement?.querySelector('bullet')?.nextSibling?.textContent?.trim();
		const stackLabel = isStackAbbr(stackLabelText) ? stackLabelText : null;
		const numTrophies = sumTrophyCount(trophyCount);
		const points = calculateTrophyPoints(trophyCount);

		return {
			id,
			slug,
			name,
			imagePath,
			stackLabel,
			platforms,
			trophyCount,
			numOwners,
			numTrophies,
			points,
		};
	}
}

/** Parses the number of owners from a Games or GameSearch game. */
function parseNumOwners(tr: HTMLTableRowElement, isSearchResult = false): number | null {
	const selector = isSearchResult
		? `td:nth-of-type(5) > span.separator.left > span.typo-top`
		: `td > span > b:first-of-type`;
	const numOwners = parseNumber(tr.querySelector(selector));
	return Number.isNaN(numOwners) ? null : numOwners;
}
