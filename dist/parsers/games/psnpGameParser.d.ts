import { IPsnpGame } from '../../index.js';
import { PsnpParser } from '../psnpParser.js';
export declare abstract class PsnpGameParser<T = IPsnpGame, E = HTMLElement> extends PsnpParser<T, E> {
    protected type: string;
    protected abstract _parse(tr: E): T | null;
}
//# sourceMappingURL=psnpGameParser.d.ts.map