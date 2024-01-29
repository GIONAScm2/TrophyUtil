import { PsnpParser } from '../psnpParser.js';
/** Parses a partial game representation from TrophyList pages. */
export class ParserGamePartialStack extends PsnpParser {
    expectedEntityType = 'Partial Game (TrophyList)';
    _parse(tr) {
        const titleAnchorEl = tr.querySelector(`td > span > span > a[href^='/trophies/']`);
        const href = titleAnchorEl?.getAttribute('href');
        const hrefIdAndTitle = this._extractIdAndTitleFromPsnpUrl({ url: href });
        const imageSrc = tr.querySelector('img[src]')?.getAttribute('src');
        if (!titleAnchorEl?.textContent || !hrefIdAndTitle || !imageSrc) {
            return null;
        }
        const _imagePath = /\w+\/\w+(?=\.[A-z]{3}$)/.exec(imageSrc)?.at(0);
        const name = titleAnchorEl.textContent.trim();
        const platforms = [...tr.querySelectorAll('span.tag.platform')].map(tag => tag.textContent).sort();
        if (!_imagePath || !name || !platforms.length) {
            return null;
        }
        const [_id, _nameSerialized] = hrefIdAndTitle;
        const stackLabel = tr.querySelector('.separator .typo-top')?.textContent?.trim() || null;
        return {
            _id,
            _nameSerialized,
            name,
            _imagePath,
            stackLabel,
            platforms,
        };
    }
}
//# sourceMappingURL=gameFromStackPanel.js.map