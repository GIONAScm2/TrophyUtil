import { PsnpParser } from '../psnpParser.js';
import { IGamePartialTrophyList } from '../../models/game.interface.js';
/** Parses a partial game representation from TrophyList pages. */
export declare class ParserGameFromTrophyList extends PsnpParser<IGamePartialTrophyList, HTMLTableRowElement> {
    protected readonly type = "Partial Game (TrophyList)";
    protected _parse(tr: HTMLTableRowElement): IGamePartialTrophyList | null;
}
//# sourceMappingURL=gamePartialTrophyList.d.ts.map