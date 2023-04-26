"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PsnpStandardGameParserSecondary = exports.PsnpStandardGameParserMain = void 0;
const psnpGameParser_js_1 = require("./psnpGameParser.js");
const index_js_1 = require("../../index.js");
/** Blueprint for parsing 'standard' games, which appear on Games and GameSearch pages.
 * Since their parsing logic is slightly different, subclassing is necessary. */
class PsnpStandardGameParser extends psnpGameParser_js_1.PsnpGameParser {
    _parse(tr) {
        const titleAnchorEl = tr.querySelector(`a.title`);
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
        const stackLabel = titleAnchorEl.parentElement
            ?.querySelector('bullet')
            ?.nextSibling?.textContent?.trim() ?? null;
        const platforms = [...tr.querySelectorAll('span.tag.platform')].map(tag => tag.textContent);
        const trophyCount = this._parseTrophyCount(tr);
        const numOwners = this._parseNumOwners(tr);
        if (!trophyCount || !numOwners) {
            return null;
        }
        return {
            _id,
            _nameSerialized,
            name,
            _imagePath,
            stackLabel,
            platforms,
            trophyCount,
            numOwners,
        };
    }
}
/** Parses 'standard' games from Games pages. */
class PsnpStandardGameParserMain extends PsnpStandardGameParser {
    _parseTrophyCount(tr) {
        const bronze = (0, index_js_1.parseNum)(tr.querySelector('.bronze.icon-sprite + span'));
        const silver = (0, index_js_1.parseNum)(tr.querySelector('.silver.icon-sprite + span'));
        const gold = (0, index_js_1.parseNum)(tr.querySelector('.gold.icon-sprite + span'));
        if (Number.isNaN(bronze + silver + gold)) {
            return null;
        }
        const platinum = tr.querySelector('.platinum.icon-sprite + span') ? 1 : 0;
        return { bronze, silver, gold, platinum };
    }
    _parseNumOwners(tr) {
        const numOwners = (0, index_js_1.parseNum)(tr.querySelector(`td > span > b:first-of-type`));
        return Number.isNaN(numOwners) ? null : numOwners;
    }
}
exports.PsnpStandardGameParserMain = PsnpStandardGameParserMain;
/** Parses 'standard' games from Home and GameSearch pages. */
class PsnpStandardGameParserSecondary extends PsnpStandardGameParser {
    _parseTrophyCount(tr) {
        const bronze = (0, index_js_1.parseNum)(tr.querySelector('.bronze.icon-sprite'));
        const silver = (0, index_js_1.parseNum)(tr.querySelector('.silver.icon-sprite'));
        const gold = (0, index_js_1.parseNum)(tr.querySelector('.gold.icon-sprite'));
        if (Number.isNaN(bronze + silver + gold)) {
            return null;
        }
        const platinum = tr.querySelector('.platinum.icon-sprite') ? 1 : 0;
        return { bronze, silver, gold, platinum };
    }
    _parseNumOwners(tr) {
        const numOwners = (0, index_js_1.parseNum)(tr.querySelector(`td:nth-of-type(5) > span.separator.left > span.typo-top`));
        return Number.isNaN(numOwners) ? null : numOwners;
    }
}
exports.PsnpStandardGameParserSecondary = PsnpStandardGameParserSecondary;
//# sourceMappingURL=psnpStandardGameParser.js.map