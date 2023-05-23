import { IGameStack, PlatformTag } from './game.interface.js';
import { MakeRequired } from '../util/util.js';
interface IGameStackFull extends MakeRequired<IGameStack, 'stack' | 'platformString' | 'stackLabels'> {
}
export declare class StackData {
    stacks: IGameStackFull[];
    constructor(stacks: IGameStack[]);
    static buildPlatformTag(platforms: PlatformTag[]): string;
    /**
     * Given an assumedly comprehensive* array of game stacks, mutates it by adding a `stack` property
     * to each that distinguishes them from each other.
     *
     * *Stacks should be validated beforehand so that 'Additional Trophies' DLCs are not interpreted as stacks.
     * */
    private labelStacks;
    /** Creates and returns a shallow copy of `stacks` containing additional properties useful for stack differentiation. */
    private buildDetailedStacks;
    /** Creates and returns a plain object map of `stackLabel` strings (keys) to corresponding games (values).
     *
     * Nullish `stackLabel`s are keyed as an empty string. */
    private mapGamesToStackLabel;
    /** Creates and returns a plain object map of `platformString` strings (keys) to corresponding games (values). */
    private mapGamesToPlatform;
}
export {};
//# sourceMappingURL=stackData.d.ts.map