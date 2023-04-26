"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PsnpGameParserFactory = void 0;
const index_js_1 = require("../../index.js");
const psnpPartialGameParser_js_1 = require("./psnpPartialGameParser.js");
const psnpStandardGameParser_js_1 = require("./psnpStandardGameParser.js");
const psnpPlayableGameParser_js_1 = require("./psnpPlayableGameParser.js");
class PsnpGameParserFactory {
    static getParser(pageType) {
        switch (pageType) {
            case index_js_1.PsnpPageType.GameTrophyList:
                return new psnpPartialGameParser_js_1.PsnpPartialGameParser();
            case index_js_1.PsnpPageType.Profile:
            case index_js_1.PsnpPageType.SeriesPage:
                return new psnpPlayableGameParser_js_1.PsnpPlayableGameParser();
            case index_js_1.PsnpPageType.Games:
                return new psnpStandardGameParser_js_1.PsnpStandardGameParserMain();
            case index_js_1.PsnpPageType.GameSearch:
                return new psnpStandardGameParser_js_1.PsnpStandardGameParserSecondary();
            case index_js_1.PsnpPageType.Home:
                return new psnpStandardGameParser_js_1.PsnpStandardGameParserSecondary();
            default:
                throw new Error('Cannot identify game parser on current page');
        }
    }
}
exports.PsnpGameParserFactory = PsnpGameParserFactory;
// const pageType = PageType.Home; // or whichever page type you need
// const parser = GameParserFactory.getParser(pageType);
// const game = parser.parse(row);
//# sourceMappingURL=factory.js.map