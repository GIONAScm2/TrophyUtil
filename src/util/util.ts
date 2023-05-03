import {type StackAbbr, StackLookup} from '../models/game.interface.js';

/** Waits a specified number of `ms`. */
export async function sleep(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export function extractKeys<T extends object>(keysObj: T): (keyof T)[] {
	return Object.keys(keysObj) as (keyof T)[];
}

/** Mapped type that removes optional properties. */
export type OnlyRequiredPropertiesOf<T> = {
	[K in keyof T as T[K] extends Required<T>[K] ? K : never]: T[K];
};

/** Creates a new type based on `T` with properties specified by `K` made required.
 *
 * @template T - The original object type.
 * @template K - A union of keys from the object type `T` that should be made required. */
export type MakeRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/** Creates a new type based on `T` with properties specified by `K` made optional.
 *
 * @template T - The original object type.
 * @template K - A union of keys from the object type `T` that should be made optional. */
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** 
 * Parses a numerical value from a string or DOM Node, returning said value or `NaN`.
 * 
 * Prior to parsing, strings are trimmed and occurrences of `,`, `%`, and `\s.+` are removed. 
 * 
 * @example
 * parseNum("5,001.5% (25.99%)") // 5001.5
 */
export function parseNum(input: string | Node | null | undefined): number {
	const inputAsNonNull = input ?? '';
	const inputAsString = typeof inputAsNonNull === 'string' ? inputAsNonNull : inputAsNonNull.textContent ?? '';
	const inputAsParsable = inputAsString.trim().replaceAll(/%|,|\s.+/g, '');
	return +inputAsParsable;
}

export function getStackAbbr(fullRegionName: string): StackAbbr | null {
	for (const [key, value] of Object.entries(StackLookup)) {
		if (value === fullRegionName) {
			return key as StackAbbr;
		}
	}
	return null;
}
