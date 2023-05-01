"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParserGameStandard = void 0;
const psnpParser_js_1 = require("../psnpParser.js");
const index_js_1 = require("../../models/index.js");
const util_js_1 = require("../../util/util.js");
/** Parses a standard game representation from Games and GameSearch pages. */
class ParserGameStandard extends psnpParser_js_1.PsnpParser {
    type = 'Standard Game';
    _parse(tr) {
        const titleAnchorEl = tr.querySelector(`a.title`);
        const href = titleAnchorEl?.getAttribute('href');
        const hrefIdAndTitle = this._extractIdAndTitleFromPsnpUrl({ url: href });
        const imageSrc = tr.querySelector('img[src]')?.getAttribute('src');
        if (!titleAnchorEl?.textContent || !hrefIdAndTitle || !imageSrc) {
            return null;
        }
        const _imagePath = /\w+\/\w+(?=\.[A-z]{3}$)/.exec(imageSrc)?.at(0);
        const name = titleAnchorEl.textContent.trim();
        const platforms = [...tr.querySelectorAll('span.tag.platform')].map(tag => tag.textContent);
        const trophyCount = this.parseTrophyCount(tr);
        const numOwners = parseNumOwners(tr);
        if (!_imagePath || !name || !platforms.length || !trophyCount || numOwners === null) {
            return null;
        }
        const [_id, _nameSerialized] = hrefIdAndTitle;
        const stackLabel = titleAnchorEl.parentElement
            ?.querySelector('bullet')
            ?.nextSibling?.textContent?.trim() ?? null;
        const numTrophies = (0, index_js_1.sumTrophyCount)(trophyCount);
        const points = (0, index_js_1.calculateTrophyPoints)(trophyCount);
        return {
            _id,
            _nameSerialized,
            name,
            _imagePath,
            stackLabel,
            platforms,
            trophyCount,
            numOwners,
            numTrophies,
            points,
        };
    }
}
exports.ParserGameStandard = ParserGameStandard;
/** Parses the number of owners from a Games or GameSearch game. */
function parseNumOwners(tr, isGameSearch = false) {
    const selector = isGameSearch
        ? `td:nth-of-type(5) > span.separator.left > span.typo-top`
        : `td > span > b:first-of-type`;
    const numOwners = (0, util_js_1.parseNum)(tr.querySelector(selector));
    return Number.isNaN(numOwners) ? null : numOwners;
}
//# sourceMappingURL=gameStandard.js.map