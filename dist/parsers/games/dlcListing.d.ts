import { PsnpParser } from '../psnpParser.js';
import { IGameDlc } from '../../models/game.interface.js';
export declare class ParserDlcListing extends PsnpParser<IGameDlc, HTMLTableRowElement> {
    protected readonly type = "DLC Listing";
    protected _parse(tr: HTMLTableRowElement): IGameDlc | null;
}
//# sourceMappingURL=dlcListing.d.ts.map