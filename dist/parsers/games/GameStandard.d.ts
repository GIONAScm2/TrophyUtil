import { PsnpParser } from '../PsnpParser.js';
import { IGameStandard } from '../../models/index.js';
/** Parses a standard game representation from either Games and GameSearch pages. */
export declare class ParserGameStandard extends PsnpParser<IGameStandard, HTMLTableRowElement> {
    protected readonly type = "Standard Game";
    protected _parse(tr: HTMLTableRowElement): IGameStandard | null;
}
//# sourceMappingURL=gameStandard.d.ts.map