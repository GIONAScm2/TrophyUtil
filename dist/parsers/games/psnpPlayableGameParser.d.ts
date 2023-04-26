import { PsnpGameParser } from './psnpGameParser.js';
import { IPsnpGamePlayable } from '../../index.js';
/** Parses a 'playable' game containing user progress from Profile and Series pages. */
export declare class PsnpPlayableGameParser extends PsnpGameParser<IPsnpGamePlayable, HTMLTableRowElement> {
    protected _parse(tr: HTMLTableRowElement): IPsnpGamePlayable | null;
}
//# sourceMappingURL=psnpPlayableGameParser.d.ts.map