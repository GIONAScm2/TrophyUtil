import {TrophyCount} from '../models/index.js';
import {parseNum} from '../util/util.js';

/** Parses an entity `T` from `E`. */
export abstract class PsnpParser<T, E> {
	/** Entity identifier to aid subclass debugging. */
	protected abstract readonly type: string;

	/** Parses an entity from a DOM target (Document or Element).
	 *
	 * @throws If any of the entity's required fields are parsed as `null`.	*/
	parse(domTarget: E): T {
		const parsedItem = this._parse(domTarget);
		if (!parsedItem) {
			throw new Error(`Failed to parse ${this.type}`);
		}
		return parsedItem;
	}

	/** Method that performs the parsing. */
	protected abstract _parse(parseTarget: E): T | null;

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
		if (!url) return;

		// Remove protocol and domain if present
		const pathname = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n]+)/, '');

		const parts = pathname?.split('/').at(index)?.split('-');
		if (!parts || parts.length < 2) return;

		const id = +parts[0];
		const nameSerialized = parts.slice(1).join('-');
		return [id, nameSerialized];
	}

	protected parseTrophyCount(tr: HTMLTableRowElement, isHomeOrGameSearch = false): TrophyCount | null {
		const suffix = isHomeOrGameSearch ? '.icon-sprite' : '.icon-sprite + span';

		const bronze = parseNum(tr.querySelector(`.bronze${suffix}`));
		const silver = parseNum(tr.querySelector(`.silver${suffix}`));
		const gold = parseNum(tr.querySelector(`.gold${suffix}`));
		if (Number.isNaN(bronze + silver + gold)) {
			return null;
		}
		const platCount = parseNum(tr.querySelector(`.platinum${suffix}`));
		const platinum = Number.isNaN(platCount) ? 0 : platCount;
		return {bronze, silver, gold, platinum};
	}
}
