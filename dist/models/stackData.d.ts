import { IGameStack, PlatformTag } from './game.interface.js';
import { MakeRequired } from '../util/util.js';
interface IGameStackFull extends MakeRequired<IGameStack, 'stack' | 'platformString'> {
}
export declare class StackData {
    stacks: IGameStackFull[];
    constructor(stacks: IGameStack[]);
    static buildPlatformTag(platforms: PlatformTag[]): string;
    /** Given an assumedly comprehensive* array of game stacks, mutates it by adding a `stack` property
     * to each that distinguishes them from each other.
     *
     * *Stacks should be validated beforehand so that 'Additional Trophies' DLCs are not interpreted as stacks.
     * */
    private label;
}
export {};
//# sourceMappingURL=stackData.d.ts.map