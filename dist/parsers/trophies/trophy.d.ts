import { type ITrophy } from '../../models/trophy.interface.js';
import { PsnpParser } from '../psnpParser.js';
export declare class ParserTrophy extends PsnpParser<ITrophy, HTMLTableRowElement> {
    protected readonly expectedEntityType = "Trophy";
    protected _parse(tr: HTMLTableRowElement): ITrophy | null;
}
