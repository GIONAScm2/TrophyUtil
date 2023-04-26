import { PsnpGameParser } from './psnpGameParser.js';
import { IPsnpGameStandard, TrophyCount } from '../../index.js';
/** Blueprint for parsing 'standard' games, which appear on Games and GameSearch pages.
 * Since their parsing logic is slightly different, subclassing is necessary. */
declare abstract class PsnpStandardGameParser extends PsnpGameParser<IPsnpGameStandard, HTMLTableRowElement> {
    protected abstract _parseTrophyCount(tableRow: HTMLTableRowElement): TrophyCount | null;
    protected abstract _parseNumOwners(tableRow: HTMLTableRowElement): number | null;
    protected _parse(tr: HTMLTableRowElement): IPsnpGameStandard | null;
}
/** Parses 'standard' games from Games pages. */
export declare class PsnpStandardGameParserMain extends PsnpStandardGameParser {
    protected _parseTrophyCount(tr: HTMLTableRowElement): TrophyCount | null;
    protected _parseNumOwners(tr: HTMLTableRowElement): number | null;
}
/** Parses 'standard' games from Home and GameSearch pages. */
export declare class PsnpStandardGameParserSecondary extends PsnpStandardGameParser {
    protected _parseTrophyCount(tr: HTMLTableRowElement): TrophyCount | null;
    protected _parseNumOwners(tr: HTMLTableRowElement): number | null;
}
export {};
//# sourceMappingURL=psnpStandardGameParser.d.ts.map