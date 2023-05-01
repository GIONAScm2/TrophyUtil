import { type StackAbbr } from '../models/game.interface.js';
/** Waits a specified number of `ms`. */
export declare function sleep(ms: number): Promise<void>;
export declare function extractKeys<T extends object>(keysObj: T): (keyof T)[];
/** Mapped type that removes optional properties. */
export type OnlyRequiredPropertiesOf<T> = {
    [K in keyof T as T[K] extends Required<T>[K] ? K : never]: T[K];
};
/** Creates a new type based on `T` with properties specified by `K` made required.
 *
 * @template T - The original object type.
 * @template K - A union of keys from the object type `T` that should be made required. */
export type MakePropertiesRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
/** Creates a new type based on `T` with properties specified by `K` made optional.
 *
 * @template T - The original object type.
 * @template K - A union of keys from the object type `T` that should be made optional. */
export type MakePropertiesOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
/**
 * Parses a numerical value from a string or DOM Node, returning said value or `NaN`.
 *
 * Prior to parsing, strings are trimmed and occurrences of `,`, `%`, and `\s.+` are removed.
 *
 * @example
 * parseNum("5,001.5% (25.99%)") // 5001.5
 */
export declare function parseNum(input: string | Node | null | undefined): number;
export declare function getStackAbbr(fullRegionName: string): StackAbbr | null;
//# sourceMappingURL=util.d.ts.map