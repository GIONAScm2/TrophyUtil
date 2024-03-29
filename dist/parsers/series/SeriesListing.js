import { calculateTrophyPoints, parseNum, sumTrophyCount } from '../../index.js';
import { parseTrophyCount } from '../common/trophyCount.js';
import { PsnpParser } from '../psnpParser.js';
export class ParserSeriesListing extends PsnpParser {
    expectedEntityType = 'Series Listing';
    _parse(tr) {
        const titleAnchorEl = tr.querySelector(`a.title`);
        const href = titleAnchorEl?.getAttribute('href');
        const hrefIdAndTitle = this._extractIdAndTitleFromPsnpUrl({ url: href });
        const imageSrc = tr.querySelector('img[src]')?.getAttribute('src');
        if (!titleAnchorEl?.textContent || !hrefIdAndTitle || !imageSrc) {
            return null;
        }
        const _imagePath = /\/series\/(.+?)\.S\.png/.exec(imageSrc)?.at(1);
        const [_id, _nameSerialized] = hrefIdAndTitle;
        const name = titleAnchorEl.textContent.trim();
        const numGames = parseNum(tr.querySelector(`td > span.small-info > b`));
        const trophyCount = parseTrophyCount(tr);
        if (!_imagePath || !name || Number.isNaN(numGames) || !trophyCount) {
            return null;
        }
        const numTrophies = sumTrophyCount(trophyCount);
        const points = calculateTrophyPoints(trophyCount);
        return {
            _id,
            _nameSerialized,
            name,
            _imagePath,
            trophyCount,
            numGames,
            numTrophies,
            points,
        };
    }
}
//# sourceMappingURL=seriesListing.js.map