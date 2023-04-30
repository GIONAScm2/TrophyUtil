"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParserTrophy = void 0;
const index_js_1 = require("../../index.js");
const psnpParser_js_1 = require("../psnpParser.js");
class ParserTrophy extends psnpParser_js_1.PsnpParser {
    type = 'Trophy';
    _parse(tr) {
        const titleAnchorEl = tr.querySelector(`a.title`);
        const href = titleAnchorEl?.getAttribute('href');
        const hrefTrophyIdAndName = this._extractIdAndTitleFromPathname({ pathname: href, index: 3 });
        const imageSrc = tr.querySelector('picture img[src]')?.getAttribute('src');
        if (!titleAnchorEl?.textContent || !hrefTrophyIdAndName || !imageSrc) {
            return null;
        }
        const _imagePath = /\/trophies\/(.+?)\.png/.exec(imageSrc)?.at(1);
        const desc = titleAnchorEl.parentElement?.querySelector('br')?.nextSibling?.textContent?.trim() ?? '';
        const grade = tr.querySelector('td > span > img[title]')?.getAttribute('title')?.trim();
        const rarity = (0, index_js_1.parseNum)(tr.querySelector('td.hover-hide span.typo-top'));
        if (!_imagePath || !grade || Number.isNaN(rarity)) {
            return null;
        }
        const [trophyId, trophyNameSerialized] = hrefTrophyIdAndName;
        const name = titleAnchorEl.textContent.trim();
        return {
            id: trophyId,
            _nameSerialized: trophyNameSerialized,
            name,
            desc,
            grade,
            rarity: +rarity,
            _imagePath,
        };
    }
}
exports.ParserTrophy = ParserTrophy;
//# sourceMappingURL=trophy.js.map