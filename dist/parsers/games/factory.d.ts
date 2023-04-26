import { PsnpPageType } from '../../index.js';
import { PsnpPartialGameParser } from './psnpPartialGameParser.js';
import { PsnpStandardGameParserMain, PsnpStandardGameParserSecondary } from './psnpStandardGameParser.js';
import { PsnpPlayableGameParser } from './psnpPlayableGameParser.js';
export declare class PsnpGameParserFactory {
    static getParser(pageType: PsnpPageType): PsnpPartialGameParser | PsnpStandardGameParserMain | PsnpStandardGameParserSecondary | PsnpPlayableGameParser;
}
//# sourceMappingURL=factory.d.ts.map