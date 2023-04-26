import { PsnpPageType } from '../../index.js';
import { PsnpPartialGameParser } from './psnpPartialGameParser.js';
import { PsnpStandardGameParserMain, PsnpStandardGameParserSecondary } from './psnpStandardGameParser.js';
import { PsnpPlayableGameParser } from './psnpPlayableGameParser.js';
export class PsnpGameParserFactory {
    static getParser(pageType) {
        switch (pageType) {
            case PsnpPageType.GameTrophyList:
                return new PsnpPartialGameParser();
            case PsnpPageType.Profile:
            case PsnpPageType.SeriesPage:
                return new PsnpPlayableGameParser();
            case PsnpPageType.Games:
                return new PsnpStandardGameParserMain();
            case PsnpPageType.GameSearch:
                return new PsnpStandardGameParserSecondary();
            case PsnpPageType.Home:
                return new PsnpStandardGameParserSecondary();
            default:
                throw new Error('Cannot identify game parser on current page');
        }
    }
}
// const pageType = PageType.Home; // or whichever page type you need
// const parser = GameParserFactory.getParser(pageType);
// const game = parser.parse(row);
//# sourceMappingURL=factory.js.map