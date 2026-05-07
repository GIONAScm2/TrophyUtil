import { parsePsnpEntityUrl } from '../util/psnp/url.js';

export type ParseIssue = {
	field: string;
	message: string;
	selector?: string | undefined;
	value?: unknown;
};

export type ParseResult<T> = { ok: true; data: T } | { ok: false; error: ParseError };

export class ParseError extends Error {
	readonly entityType: string;
	readonly issues: ParseIssue[];

	constructor(entityType: string, issues: ParseIssue[]) {
		const issueText = issues.map(issue => `${issue.field}: ${issue.message}`).join('; ');
		super(`Failed to parse ${entityType}${issueText ? ` (${issueText})` : ''}`);
		this.name = 'ParseError';
		this.entityType = entityType;
		this.issues = issues;
	}
}

/** Parses an entity `T` from `E`. */
export abstract class PsnpParser<T, E> {
	protected abstract readonly expectedEntityType: string;
	private issues: ParseIssue[] = [];

	parse(domTarget: E): T {
		const result = this.tryParse(domTarget);
		if (!result.ok) {
			throw result.error;
		}
		return result.data;
	}

	tryParse(domTarget: E): ParseResult<T> {
		this.issues = [];
		try {
			const parsedItem = this._parse(domTarget);
			if (parsedItem === null) {
				return { ok: false, error: this.createError() };
			}
			return { ok: true, data: parsedItem };
		} catch (err) {
			if (err instanceof ParseError) {
				return { ok: false, error: err };
			}
			const issue: ParseIssue = {
				field: 'unknown',
				message: err instanceof Error ? err.message : 'Unknown parser failure',
			};
			return { ok: false, error: new ParseError(this.expectedEntityType, [issue]) };
		}
	}

	protected abstract _parse(parseTarget: E): T | null;

	protected addIssue(issue: ParseIssue): void {
		this.issues.push(issue);
	}

	protected hasIssues(): boolean {
		return this.issues.length > 0;
	}

	protected missing(field: string, selector?: string): null {
		this.addIssue({ field, selector, message: 'Missing required value' });
		return null;
	}

	protected invalid(field: string, value: unknown, message = 'Invalid value', selector?: string): null {
		this.addIssue({ field, selector, value, message });
		return null;
	}

	private createError(): ParseError {
		const issues = this.issues.length ? this.issues : [{ field: 'root', message: 'Parser returned no data' }];
		return new ParseError(this.expectedEntityType, issues);
	}

	/**
	 * Given a PSNP url (href or pathname), returns a tuple of the entity ID and serialized name.
	 *
	 * @returns {[number, string]|undefined} A tuple containing the extracted entity ID and serialized name, or `undefined` if extraction fails.
	 *
	 * @example <caption>By default, an `index` of 2 is passed:</caption>
	 * _extractIdAndTitleFromPsnpUrl({url: "/series/234-rock-band"});
	 * // Output: [234, "rock-band"]

	 * @example <caption>Passing `index` explicitly:</caption>
	 * _extractIdAndTitleFromPsnpUrl({url: "/trophy/3-call-of-duty/1-the-end-of-war", index: 3});
	 * // Output: [1, "the-end-of-war"]
	 */
	protected _extractIdAndTitleFromPsnpUrl({
		url,
		index = 2,
	}: {
		/** The PSNP URL (href or pathname) */
		url: string | null | undefined;
		/** Index of the `.split("/")` pathname where the ID and serialized name are expected */
		index?: 2 | 3;
	}): [number, string] | undefined {
		const parts = parsePsnpEntityUrl(url, index);
		return parts ? [parts.id, parts.slug] : undefined;
	}

	protected throwError(prop: string) {
		throw new Error(`Failed to parse "${prop}" for ${this.expectedEntityType}`);
	}
}
