"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PsnpSeriesListingParser = void 0;
const index_js_1 = require("../../index.js");
const psnpParser_js_1 = require("../psnpParser.js");
class PsnpSeriesListingParser extends psnpParser_js_1.PsnpParser {
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
        const numGames = (0, index_js_1.parseNum)(tr.querySelector(`td > span.small-info > b`));
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
        const bronze = (0, index_js_1.parseNum)(tr.querySelector('.bronze.icon-sprite + span'));
        const silver = (0, index_js_1.parseNum)(tr.querySelector('.silver.icon-sprite + span'));
        const gold = (0, index_js_1.parseNum)(tr.querySelector('.gold.icon-sprite + span'));
        if (Number.isNaN(bronze + silver + gold)) {
            return null;
        }
        const platCount = (0, index_js_1.parseNum)(tr.querySelector('.platinum.icon-sprite + span'));
        const platinum = Number.isNaN(platCount) ? 0 : platCount;
        return { bronze, silver, gold, platinum };
    }
}
exports.PsnpSeriesListingParser = PsnpSeriesListingParser;
//# sourceMappingURL=psnpSeriesListingParser.js.map