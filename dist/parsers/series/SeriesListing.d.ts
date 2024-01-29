import { ISeriesListing } from '../../models/series.interface.js';
import { PsnpParser } from '../psnpParser.js';
export declare class ParserSeriesListing extends PsnpParser<ISeriesListing, HTMLTableRowElement> {
    protected readonly expectedEntityType = "Series Listing";
    protected _parse(tr: HTMLTableRowElement): ISeriesListing | null;
}
//# sourceMappingURL=seriesListing.d.ts.map