import { PsnpParser } from '../psnpParser.js';
import type { GameStackEntry } from '../../models/game.interface.js';
import { isStackAbbr, parsePlatformTags } from '../../util/util.js';

/** Parses a stack-panel game representation from trophy-list pages. */
export class GameStackEntryParser extends PsnpParser<GameStackEntry, HTMLTableRowElement> {
	protected readonly expectedEntityType = 'Game Stack Entry';

	protected _parse(tr: HTMLTableRowElement): GameStackEntry | null {
		const titleAnchorEl = tr.querySelector(`td > span > span > a[href^='/trophies/']`);
		const href = titleAnchorEl?.getAttribute('href');
		const hrefIdAndTitle = this._extractIdAndTitleFromPsnpUrl({ url: href });
		const imageSrc = tr.querySelector('img[src]')?.getAttribute('src');

		if (!titleAnchorEl?.textContent || !hrefIdAndTitle || !imageSrc) {
			if (!titleAnchorEl?.textContent)
				this.addIssue({ field: 'name', selector: 'a[href^="/trophies/"]', message: 'Missing game title' });
			if (!hrefIdAndTitle) this.addIssue({ field: 'url', message: 'Missing or invalid stack URL' });
			if (!imageSrc) this.addIssue({ field: 'imagePath', selector: 'img[src]', message: 'Missing game image' });
			return null;
		}

		const imagePath = /\w+\/\w+(?=\.[A-z]{3}$)/.exec(imageSrc)?.at(0);
		const name = titleAnchorEl.textContent.trim();
		const platforms = parsePlatformTags(tr);

		if (!imagePath || !name || !platforms.length) {
			if (!imagePath)
				this.addIssue({ field: 'imagePath', selector: 'img[src]', message: 'Unable to extract image path' });
			if (!name) this.addIssue({ field: 'name', message: 'Missing game title text' });
			if (!platforms.length)
				this.addIssue({ field: 'platforms', selector: 'span.tag.platform', message: 'Missing platform tags' });
			return null;
		}

		const [id, slug] = hrefIdAndTitle;
		const stackLabelText = tr.querySelector('.separator .typo-top')?.textContent?.trim();
		const stackLabel = isStackAbbr(stackLabelText) ? stackLabelText : null;

		return {
			id,
			slug,
			name,
			imagePath,
			stackLabel,
			platforms,
		};
	}
}
