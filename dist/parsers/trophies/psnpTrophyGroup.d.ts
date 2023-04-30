import { ITrophyGroup } from '../../index.js';
import { PsnpParser } from '../psnpParser.js';
export declare class PsnpTrophyGroupsParser extends PsnpParser<ITrophyGroup[], Document> {
    doc: Document;
    protected readonly type = "Trophy Group";
    trophyGroupNodes: HTMLDivElement[];
    constructor(doc: Document);
    protected _parse(): ITrophyGroup[];
    /** Returns an array of nodes representing the trophy list's trophy groups. */
    getTrophyGroups(): HTMLDivElement[];
    /** Given a trophy group node, returns the name of the group. */
    trophyGroupName(trophyGroup: HTMLDivElement): 'Base Game' | string;
    /** Given a trophy group node, returns the `HTMLTableElement` containing the group's trophy nodes. */
    trophyGroupTrophyTable(trophyGroup: HTMLDivElement): HTMLTableElement | null;
}
//# sourceMappingURL=psnpTrophyGroup.d.ts.map