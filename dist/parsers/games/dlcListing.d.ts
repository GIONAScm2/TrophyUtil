import { PsnpParser } from '../psnpParser.js';
import { IDlcListing } from '../../models/game.interface.js';
export declare class ParserDlcListing extends PsnpParser<IDlcListing, HTMLTableRowElement> {
    protected readonly type = "DLC Listing";
    protected _parse(tr: HTMLTableRowElement): IDlcListing | null;
}
//# sourceMappingURL=dlcListing.d.ts.map