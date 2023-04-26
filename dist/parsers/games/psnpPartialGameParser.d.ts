import { IPsnpGamePartial } from '../../index.js';
import { PsnpGameParser } from './psnpGameParser.js';
/** Parses a partial game representation from "Other Platforms and Regions". */
export declare class PsnpPartialGameParser extends PsnpGameParser<IPsnpGamePartial, HTMLTableRowElement> {
    protected _parse(tr: HTMLTableRowElement): IPsnpGamePartial | null;
}
//# sourceMappingURL=psnpPartialGameParser.d.ts.map