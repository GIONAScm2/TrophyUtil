import { TrophyCount } from '../../index.js';
import { IPsnpSeriesListing } from '../../models/series.interface.js';
import { PsnpParser } from '../psnpParser.js';
export declare class PsnpSeriesListingParser extends PsnpParser<IPsnpSeriesListing, HTMLTableRowElement> {
    protected readonly type = "Series Listing";
    protected _parse(tr: HTMLTableRowElement): IPsnpSeriesListing | null;
    protected _parseTrophyCount(tr: HTMLTableRowElement): TrophyCount | null;
}
//# sourceMappingURL=psnpSeriesListingParser.d.ts.map