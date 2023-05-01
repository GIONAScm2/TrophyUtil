import {ITrophy, TrophyGrade, parseNum} from '../../index.js';
import {PsnpParser} from '../psnpParser.js';

export class ParserTrophy extends PsnpParser<ITrophy, HTMLTableRowElement> {
	protected readonly type = 'Trophy';

	protected _parse(tr: HTMLTableRowElement): ITrophy | null {
		const titleAnchorEl = tr.querySelector(`a.title`);
		const href = titleAnchorEl?.getAttribute('href');
		const hrefTrophyIdAndName = this._extractIdAndTitleFromPsnpUrl({url: href, index: 3});
		const imageSrc = tr.querySelector('picture img[src]')?.getAttribute('src');

		if (!titleAnchorEl?.textContent || !hrefTrophyIdAndName || !imageSrc) {
			return null;
		}

		const _imagePath = /\/trophies\/(.+?)\.png/.exec(imageSrc)?.at(1);
		const desc = titleAnchorEl.parentElement?.querySelector('br')?.nextSibling?.textContent?.trim() ?? '';
		const grade = tr.querySelector('td > span > img[title]')?.getAttribute('title')?.trim() as TrophyGrade;
		const rarity = parseNum(tr.querySelector('td.hover-hide span.typo-top'));

		if (!_imagePath || !grade || Number.isNaN(rarity)) {
			return null;
		}

		const [trophyId, trophyNameSerialized] = hrefTrophyIdAndName;
		const name = titleAnchorEl.textContent.trim();

		return {
			id: trophyId,
			_nameSerialized: trophyNameSerialized,
			name,
			desc,
			grade,
			rarity: +rarity,
			_imagePath,
		};
	}
}
