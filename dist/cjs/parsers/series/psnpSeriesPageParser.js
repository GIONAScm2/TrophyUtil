"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PsnpSeriesPageParser = void 0;
const index_js_1 = require("../../index.js");
const psnpParser_js_1 = require("../psnpParser.js");
class PsnpSeriesPageParser extends psnpParser_js_1.PsnpParser {
    type = 'Series Page';
    _parse(page) {
        const name = page.doc.querySelector(`div.series-info div.ellipsis > span`)?.textContent?.trim();
        const hrefIdAndTitle = this._extractIdAndTitleFromHref(page.url.pathname);
        const imageSrc = page.doc.querySelector('div.series-info picture img[src]')?.getAttribute('src');
        if (!name || !hrefIdAndTitle || !imageSrc) {
            return null;
        }
        const [_id, _nameSerialized] = hrefIdAndTitle;
        const _imagePath = /\/series\/(.+?)\.S\.png/.exec(imageSrc)?.at(1);
        if (!_imagePath) {
            return null;
        }
        const gameParser = new index_js_1.PsnpPlayableGameParser();
        const stageElements = [...page.doc.querySelectorAll(`table.box.zebra.series`)];
        const stages = stageElements.map(el => {
            const stageNumString = el.querySelector(`tr:first-of-type > td:first-of-type span.typo-top`)?.textContent?.trim() ?? '';
            const stageNum = stageNumString === 'NO' ? 0 : +stageNumString;
            const gameIds = [...el.querySelectorAll('tr')].map(tr => gameParser.parse(tr)._id);
            return { stageNum, gameIds };
        });
        return {
            _id,
            _nameSerialized,
            name,
            _imagePath,
            stages,
        };
    }
}
exports.PsnpSeriesPageParser = PsnpSeriesPageParser;
//# sourceMappingURL=psnpSeriesPageParser.js.map