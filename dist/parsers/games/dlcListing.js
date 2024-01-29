import { PsnpParser } from '../psnpParser.js';
import { calculateTrophyPoints, sumTrophyCount } from '../../models/common.js';
import { parseTrophyCount } from '../common/trophyCount.js';
export class ParserDlcListing extends PsnpParser {
    expectedEntityType = 'DLC Listing';
    _parse(tr) {
        const titleAnchorEl = tr.querySelector(`td a.title`);
        const href = titleAnchorEl?.getAttribute('href');
        const hrefIdAndTitle = this._extractIdAndTitleFromPsnpUrl({ url: href });
        const imageSrc = tr.querySelector('img[src]')?.getAttribute('src');
        if (!titleAnchorEl?.textContent || !hrefIdAndTitle || !imageSrc) {
            return null;
        }
        const [_id, _nameSerialized] = hrefIdAndTitle;
        const name = titleAnchorEl?.lastChild?.textContent?.trim();
        const dlcName = titleAnchorEl?.firstChild?.textContent?.trim();
        const groupNumMatch = _nameSerialized.match(/DLC-(\d+)/);
        const _imagePath = /\w+\/\w+(?=\.[A-z]{3}$)/.exec(imageSrc)?.at(0);
        const platforms = [...tr.querySelectorAll('span.tag.platform')].map(tag => tag.textContent).sort();
        if (!_imagePath || !name || !dlcName || !platforms.length || !groupNumMatch) {
            return null;
        }
        const groupNum = +groupNumMatch[1];
        const trophyCount = parseTrophyCount(tr, true);
        if (!trophyCount) {
            return null;
        }
        const numTrophies = sumTrophyCount(trophyCount);
        const points = calculateTrophyPoints(trophyCount);
        return {
            _id,
            _nameSerialized: _nameSerialized.replace(/#DLC.+/, ''),
            name,
            _imagePath,
            dlcName,
            groupNum,
            platforms,
            trophyCount,
            numTrophies,
            points,
        };
    }
}
//# sourceMappingURL=dlcListing.js.map