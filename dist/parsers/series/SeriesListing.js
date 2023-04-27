import { calculateTrophyPoints, parseNum, sumTrophyCount } from '../../index.js';
import { PsnpParser } from '../PsnpParser.js';
export class ParserSeriesListing extends PsnpParser {
    type = 'Series Listing';
    _parse(tr) {
        const titleAnchorEl = tr.querySelector(`a.title`);
        const href = titleAnchorEl?.getAttribute('href');
        const hrefIdAndTitle = this._extractIdAndTitleFromPathname({ pathname: href });
        const imageSrc = tr.querySelector('img[src]')?.getAttribute('src');
        if (!titleAnchorEl?.textContent || !hrefIdAndTitle || !imageSrc) {
            return null;
        }
        const _imagePath = /\/series\/(.+?)\.S\.png/.exec(imageSrc)?.at(1);
        const [_id, _nameSerialized] = hrefIdAndTitle;
        const name = titleAnchorEl.textContent.trim();
        const numGames = parseNum(tr.querySelector(`td > span.small-info > b`));
        const trophyCount = this.parseTrophyCount(tr);
        if (!_imagePath || Number.isNaN(numGames) || !trophyCount) {
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