import { type StackAbbr } from '../models/game.interface.js';
/** Waits a specified number of `ms`. */
export declare function sleep(ms: number): Promise<void>;
export declare function extractKeys<T extends object>(keysObj: T): (keyof T)[];
/** Mapped type that removes optional properties. */
export type OnlyRequiredPropertiesOf<T> = {
    [K in keyof T as T[K] extends Required<T>[K] ? K : never]: T[K];
};
/** Mapped type that makes some properties optional. */
export type MakePropertiesRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
/** Parses a number from a string or DOM Node, taking care of trimming strings and parsing comma and percent characters. */
export declare function parseNum(input: string | Node | null | undefined): number;
export declare function getAbbreviation(regionName: string): StackAbbr | null;
//# sourceMappingURL=util.d.ts.map