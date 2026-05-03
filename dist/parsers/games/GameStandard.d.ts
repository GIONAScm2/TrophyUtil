import { PsnpParser } from '../psnpParser.js';
import { type IGameStandard } from '../../models/game.interface.js';
/** Parses a standard game representation from Games and GameSearch pages. */
export declare class ParserGameStandard extends PsnpParser<IGameStandard, HTMLTableRowElement> {
    protected readonly expectedEntityType = "Standard Game";
    protected _parse(tr: HTMLTableRowElement): IGameStandard | null;
}
