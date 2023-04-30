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

/** Mapped type that makes some properties optional. */
export type MakePropertiesRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/** Parses a numerical value from a string or DOM Node, returning said value or `NaN`.
 * Prior to parsing, strings are trimmed and occurrences of `,` and `%` are removed. */
export function parseNum(input: string | Node | null | undefined): number {
	const narrowedInput = input ?? '';
	const text = typeof narrowedInput === 'string' ? narrowedInput : narrowedInput.textContent ?? '';
	const cleanText = text.trim().replaceAll(/%|,/g, '');
	return +cleanText;
}

export function getAbbreviation(regionName: string): StackAbbr | null {
	for (const [key, value] of Object.entries(StackLookup)) {
		if (value === regionName) {
			return key as StackAbbr;
		}
	}
	return null;
}
