"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParserDlcListing = void 0;
const psnpParser_js_1 = require("../psnpParser.js");
const common_js_1 = require("../../models/common.js");
class ParserDlcListing extends psnpParser_js_1.PsnpParser {
    type = 'DLC Listing';
    _parse(tr) {
        const titleAnchorEl = tr.querySelector(`td a.title`);
        const href = titleAnchorEl?.getAttribute('href');
        const hrefIdAndTitle = this._extractIdAndTitleFromPsnpUrl({ url: href });
        const imageSrc = tr.querySelector('img[src]')?.getAttribute('src');
        if (!titleAnchorEl?.textContent || !hrefIdAndTitle || !imageSrc) {
            return null;
        }
        const [_id, _nameSerialized] = hrefIdAndTitle;
        const name = titleAnchorEl?.firstChild?.textContent?.trim();
        const groupNumMatch = _nameSerialized.match(/DLC-(\d+)/);
        const _imagePath = /\w+\/\w+(?=\.[A-z]{3}$)/.exec(imageSrc)?.at(0);
        const platforms = [...tr.querySelectorAll('span.tag.platform')].map(tag => tag.textContent).sort();
        if (!_imagePath || !name || !platforms.length || !groupNumMatch) {
            return null;
        }
        const groupNum = +groupNumMatch[1];
        const trophyCount = this.parseTrophyCount(tr, true);
        if (!trophyCount) {
            return null;
        }
        const numTrophies = (0, common_js_1.sumTrophyCount)(trophyCount);
        const points = (0, common_js_1.calculateTrophyPoints)(trophyCount);
        return {
            _id,
            _nameSerialized,
            name,
            _imagePath,
            groupNum,
            platforms,
            trophyCount,
            numTrophies,
            points,
        };
    }
}
exports.ParserDlcListing = ParserDlcListing;
//# sourceMappingURL=dlcListing.js.map