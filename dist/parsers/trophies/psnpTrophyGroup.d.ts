import { ITrophyGroup } from '../../index.js';
import { PsnpParser } from '../PsnpParser.js';
export declare class PsnpTrophyGroupParser extends PsnpParser<ITrophyGroup[], Document> {
    protected readonly type = "Trophy Group";
    protected _parse(doc: Document): ITrophyGroup[];
}
//# sourceMappingURL=psnpTrophyGroup.d.ts.map