import { PsnpParser } from '../psnpParser.js';
import { IGamePlayable } from '../../index.js';
/** Parses a 'playable' game containing user progress from Profile and Series pages. */
export declare class ParserGamePlayable extends PsnpParser<IGamePlayable, HTMLTableRowElement> {
    protected readonly expectedEntityType = "Playable Game";
    protected _parse(tr: HTMLTableRowElement): IGamePlayable | null;
}
//# sourceMappingURL=gamePlayable.d.ts.map