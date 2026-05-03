import { calculateTrophyPoints, sumTrophyCount } from '../../models/common.js';
import type { SeriesListing } from '../../models/series.interface.js';
import { parseTrophyCount } from '../common/trophyCount.js';
import { PsnpParser } from '../psnpParser.js';
import { parseNumber } from '../../util/util.js';

export class SeriesListingParser extends PsnpParser<SeriesListing, HTMLTableRowElement> {
	protected readonly expectedEntityType = 'Series Listing';

	protected _parse(tr: HTMLTableRowElement): SeriesListing | null {
		const titleAnchorEl = tr.querySelector(`a.title`);
		const href = titleAnchorEl?.getAttribute('href');
		const hrefIdAndTitle = this._extractIdAndTitleFromPsnpUrl({ url: href });
		const imageSrc = tr.querySelector('img[src]')?.getAttribute('src');

		if (!titleAnchorEl?.textContent || !hrefIdAndTitle || !imageSrc) {
			return null;
		}

		const imagePath = /\/series\/(.+?)\.S\.png/.exec(imageSrc)?.at(1);
		const [id, slug] = hrefIdAndTitle;
		const name = titleAnchorEl.textContent.trim();
		const numGames = parseNumber(tr.querySelector(`td > span.small-info > b`));
		const trophyCount = parseTrophyCount(tr);

		if (!imagePath || !name || Number.isNaN(numGames) || !trophyCount) {
			return null;
		}
		const numTrophies = sumTrophyCount(trophyCount);
		const points = calculateTrophyPoints(trophyCount);

		return {
			id,
			slug,
			name,
			imagePath,
			trophyCount,
			numGames,
			numTrophies,
			points,
		};
	}
}
