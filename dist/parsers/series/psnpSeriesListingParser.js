import { parseNum } from '../../index.js';
import { PsnpParser } from '../psnpParser.js';
export class PsnpSeriesListingParser extends PsnpParser {
    type = 'Series Listing';
    _parse(tr) {
        const titleAnchorEl = tr.querySelector(`a.title`);
        const href = titleAnchorEl?.getAttribute('href');
        const hrefIdAndTitle = this._extractIdAndTitleFromHref(href);
        const imageSrc = tr.querySelector('img[src]')?.getAttribute('src');
        if (!titleAnchorEl?.textContent || !hrefIdAndTitle || !imageSrc) {
            return null;
        }
        const _imagePath = /\/series\/(.+?)\.S\.png/.exec(imageSrc)?.at(1);
        const [_id, _nameSerialized] = hrefIdAndTitle;
        const name = titleAnchorEl.textContent.trim();
        const numGames = parseNum(tr.querySelector(`td > span.small-info > b`));
        const trophyCount = this._parseTrophyCount(tr);
        if (!_imagePath || Number.isNaN(numGames) || !trophyCount) {
            return null;
        }
        return {
            _id,
            _nameSerialized,
            name,
            _imagePath,
            trophyCount,
            numGames,
        };
    }
    _parseTrophyCount(tr) {
        const bronze = parseNum(tr.querySelector('.bronze.icon-sprite + span'));
        const silver = parseNum(tr.querySelector('.silver.icon-sprite + span'));
        const gold = parseNum(tr.querySelector('.gold.icon-sprite + span'));
        if (Number.isNaN(bronze + silver + gold)) {
            return null;
        }
        const platCount = parseNum(tr.querySelector('.platinum.icon-sprite + span'));
        const platinum = Number.isNaN(platCount) ? 0 : platCount;
        return { bronze, silver, gold, platinum };
    }
}
//# sourceMappingURL=psnpSeriesListingParser.js.map