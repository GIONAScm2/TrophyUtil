import { ITrophy } from '../../index.js';
import { PsnpParser } from '../psnpParser.js';
export declare class PsnpTrophyParser extends PsnpParser<ITrophy, HTMLTableRowElement> {
    protected readonly type = "Trophy";
    protected _parse(tr: HTMLTableRowElement): ITrophy | null;
}
//# sourceMappingURL=psnpTrophyParser.d.ts.map