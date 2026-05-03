import { PsnpParser } from '../psnpParser.js';
import { type IGamePlayable } from '../../models/game.interface.js';
/** Parses a 'playable' game containing user progress from Profile and Series pages. */
export declare class ParserGamePlayable extends PsnpParser<IGamePlayable, HTMLTableRowElement> {
    protected readonly expectedEntityType = "Playable Game";
    protected _parse(tr: HTMLTableRowElement): IGamePlayable | null;
}
