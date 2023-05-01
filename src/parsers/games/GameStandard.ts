import {PsnpParser} from '../psnpParser.js';
import {
	PlatformTag,
	StackAbbrNullable,
	IGameStandard,
	calculateTrophyPoints,
	sumTrophyCount,
} from '../../models/index.js';
import {parseNum} from '../../util/util.js';

/** Parses a standard game representation from Games and GameSearch pages. */
export class ParserGameStandard extends PsnpParser<IGameStandard, HTMLTableRowElement> {
	protected readonly type = 'Standard Game';

	protected _parse(tr: HTMLTableRowElement): IGameStandard | null {
		const titleAnchorEl = tr.querySelector(`a.title`);
		const href = titleAnchorEl?.getAttribute('href');
		const hrefIdAndTitle = this._extractIdAndTitleFromPsnpUrl({url: href});
		const imageSrc = tr.querySelector('img[src]')?.getAttribute('src');

		if (!titleAnchorEl?.textContent || !hrefIdAndTitle || !imageSrc) {
			return null;
		}

		const _imagePath = /\w+\/\w+(?=\.[A-z]{3}$)/.exec(imageSrc)?.at(0);
		const name = titleAnchorEl.textContent.trim();
		const platforms = [...tr.querySelectorAll('span.tag.platform')].map(tag => tag.textContent) as PlatformTag[];
		const trophyCount = this.parseTrophyCount(tr);
		const numOwners = parseNumOwners(tr);

		if (!_imagePath || !name || !platforms.length || !trophyCount || numOwners === null) {
			return null;
		}

		const [_id, _nameSerialized] = hrefIdAndTitle;
		const stackLabel =
			(titleAnchorEl.parentElement
				?.querySelector('bullet')
				?.nextSibling?.textContent?.trim() as StackAbbrNullable) ?? null;
		const numTrophies = sumTrophyCount(trophyCount);
		const points = calculateTrophyPoints(trophyCount);

		return {
			_id,
			_nameSerialized,
			name,
			_imagePath,
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
function parseNumOwners(tr: HTMLTableRowElement, isGameSearch = false): number | null {
	const selector = isGameSearch
		? `td:nth-of-type(5) > span.separator.left > span.typo-top`
		: `td > span > b:first-of-type`;
	const numOwners = parseNum(tr.querySelector(selector));
	return Number.isNaN(numOwners) ? null : numOwners;
}
