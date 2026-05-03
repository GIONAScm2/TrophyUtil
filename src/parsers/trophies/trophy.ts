import { TROPHY_GRADES, type Trophy, type TrophyGrade } from '../../models/trophy.interface.js';
import { PsnpParser } from '../psnpParser.js';
import { parseNumber } from '../../util/util.js';

export class TrophyParser extends PsnpParser<Trophy, HTMLTableRowElement> {
	protected readonly expectedEntityType = 'Trophy';

	protected _parse(tr: HTMLTableRowElement): Trophy | null {
		const titleAnchorEl = tr.querySelector(`a.title`);
		const href = titleAnchorEl?.getAttribute('href');
		const hrefTrophyIdAndName = this._extractIdAndTitleFromPsnpUrl({ url: href, index: 3 });
		const imageSrc = tr.querySelector('picture img[src]')?.getAttribute('src');

		if (!titleAnchorEl?.textContent || !hrefTrophyIdAndName || !imageSrc) {
			return null;
		}

		const imagePath = /\/trophies\/(.+?)\.png/.exec(imageSrc)?.at(1);
		const desc = titleAnchorEl.parentElement?.querySelector('br')?.nextSibling?.textContent?.trim() ?? '';
		const gradeText = tr.querySelector('td > span > img[title]')?.getAttribute('title')?.trim();
		const grade = isTrophyGrade(gradeText) ? gradeText : undefined;
		const rarity = parseNumber(tr.querySelector('td.hover-hide span.typo-top'));

		if (!imagePath || !grade || Number.isNaN(rarity)) {
			if (!imagePath)
				this.addIssue({
					field: 'imagePath',
					selector: 'picture img[src]',
					message: 'Unable to extract image path',
				});
			if (!grade)
				this.addIssue({ field: 'grade', selector: 'img[title]', message: 'Missing or invalid trophy grade' });
			if (Number.isNaN(rarity)) this.addIssue({ field: 'rarity', message: 'Unable to parse trophy rarity' });
			return null;
		}

		const [trophyId, trophyNameSerialized] = hrefTrophyIdAndName;
		const name = titleAnchorEl.textContent.trim();

		return {
			id: trophyId,
			slug: trophyNameSerialized,
			name,
			desc,
			grade,
			rarity: +rarity,
			imagePath,
		};
	}
}

function isTrophyGrade(value: string | undefined): value is TrophyGrade {
	return !!value && TROPHY_GRADES.includes(value as TrophyGrade);
}
