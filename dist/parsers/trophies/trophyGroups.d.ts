import { ITrophyGroup } from '../../index.js';
import { PsnpParser } from '../psnpParser.js';
export declare class ParserTrophyGroups extends PsnpParser<ITrophyGroup[], Document> {
    protected readonly type = "Trophy Group";
    protected _parse(doc: Document): ITrophyGroup[];
    /** Returns an array of nodes representing the trophy list's trophy groups. */
    protected getTrophyGroups(doc: Document): HTMLDivElement[];
    /** Given a trophy group node, returns the name of the group. */
    protected trophyGroupName(trophyGroup: HTMLDivElement): 'Base Game' | string;
    /** Given a trophy group node, returns the `HTMLTableElement` containing the group's trophy nodes. */
    protected trophyGroupTrophyTable(trophyGroup: HTMLDivElement): HTMLTableElement | null;
}
//# sourceMappingURL=trophyGroups.d.ts.map