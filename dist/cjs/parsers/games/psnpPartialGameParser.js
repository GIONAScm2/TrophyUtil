"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PsnpPartialGameParser = void 0;
const psnpGameParser_js_1 = require("./psnpGameParser.js");
/** Parses a partial game representation from "Other Platforms and Regions". */
class PsnpPartialGameParser extends psnpGameParser_js_1.PsnpGameParser {
    _parse(tr) {
        const titleAnchorEl = tr.querySelector(`td > span > span > a[href^='/trophies/']`);
        const href = titleAnchorEl?.getAttribute('href');
        const hrefIdAndTitle = this._extractIdAndTitleFromHref(href);
        const imageSrc = tr.querySelector('img[src]')?.getAttribute('src');
        if (!titleAnchorEl?.textContent || !hrefIdAndTitle || !imageSrc) {
            return null;
        }
        const _imagePath = /\w+\/\w+(?=\.[A-z]{3}$)/.exec(imageSrc)?.at(0);
        if (!_imagePath) {
            return null;
        }
        const [_id, _nameSerialized] = hrefIdAndTitle;
        const name = titleAnchorEl.textContent.trim();
        const stackLabel = tr.querySelector('.separator .typo-top')?.textContent?.trim() || null;
        const platforms = [...tr.querySelectorAll('span.tag.platform')].map(tag => tag.textContent);
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
exports.PsnpPartialGameParser = PsnpPartialGameParser;
//# sourceMappingURL=psnpPartialGameParser.js.map