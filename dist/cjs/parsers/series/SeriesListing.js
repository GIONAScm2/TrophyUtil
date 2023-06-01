"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParserSeriesListing = void 0;
const index_js_1 = require("../../index.js");
const trophyCount_js_1 = require("../common/trophyCount.js");
const psnpParser_js_1 = require("../psnpParser.js");
class ParserSeriesListing extends psnpParser_js_1.PsnpParser {
    type = 'Series Listing';
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
        const numGames = (0, index_js_1.parseNum)(tr.querySelector(`td > span.small-info > b`));
        const trophyCount = (0, trophyCount_js_1.parseTrophyCount)(tr);
        if (!_imagePath || !name || Number.isNaN(numGames) || !trophyCount) {
            return null;
        }
        const numTrophies = (0, index_js_1.sumTrophyCount)(trophyCount);
        const points = (0, index_js_1.calculateTrophyPoints)(trophyCount);
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
exports.ParserSeriesListing = ParserSeriesListing;
//# sourceMappingURL=seriesListing.js.map