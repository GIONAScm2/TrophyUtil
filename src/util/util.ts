import { PLATFORM_TAGS, type PlatformTag, type StackAbbr, STACK_LOOKUP } from '../models/game.interface.js';

/** Waits a specified number of `ms`. */
export async function sleep(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export function extractKeys<T extends object>(keysObj: T): Array<keyof T> {
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
 * parseNumber("5,001.5% (25.99%)") // 5001.5
 */
export function parseNumber(input: string | Node | null | undefined): number {
	const inputAsNonNull = input ?? '';
	const inputAsString = typeof inputAsNonNull === 'string' ? inputAsNonNull : (inputAsNonNull.textContent ?? '');
	const inputAsParsable = inputAsString.trim().replaceAll(/%|,|\s.+/g, '');
	if (inputAsParsable === '') return Number.NaN;
	return Number.parseFloat(inputAsParsable);
}

export function isStackAbbr(value: string | null | undefined): value is StackAbbr {
	return !!value && value in STACK_LOOKUP;
}

export function getStackAbbr(fullRegionName: string): StackAbbr | null {
	for (const [key, value] of Object.entries(STACK_LOOKUP)) {
		if (value === fullRegionName) {
			return key as StackAbbr;
		}
	}
	return null;
}

export function isPlatformTag(value: string | null | undefined): value is PlatformTag {
	return PLATFORM_TAGS.includes(value as PlatformTag);
}

export function parsePlatformTags(parent: ParentNode): PlatformTag[] {
	return [...parent.querySelectorAll('span.tag.platform')]
		.map(tag => tag.textContent?.trim())
		.filter(isPlatformTag)
		.sort();
}
