import { PsnpParser } from '../psnpParser.js';
import { IGameStandard } from '../../models/index.js';
/** Parses a standard game representation from either Games and GameSearch pages. */
export declare class ParserGameStandard extends PsnpParser<IGameStandard, HTMLTableRowElement> {
    protected readonly type = "Standard Game";
    protected _parse(tr: HTMLTableRowElement): IGameStandard | null;
}
//# sourceMappingURL=GameStandard.d.ts.map