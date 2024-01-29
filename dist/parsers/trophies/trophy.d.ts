import { ITrophy } from '../../index.js';
import { PsnpParser } from '../psnpParser.js';
export declare class ParserTrophy extends PsnpParser<ITrophy, HTMLTableRowElement> {
    protected readonly expectedEntityType = "Trophy";
    protected _parse(tr: HTMLTableRowElement): ITrophy | null;
}
//# sourceMappingURL=trophy.d.ts.map