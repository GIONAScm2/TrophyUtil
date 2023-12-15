/** Parses an entity `T` from `E`. */
export abstract class PsnpParser<T, E> {
	protected abstract readonly expectedEntityType: string;

	parse(domTarget: E): T {
		try {
			const parsedItem = this._parse(domTarget);
			if (!parsedItem) {
				throw new Error(`Failed to parse ${this.expectedEntityType}`);
			}
			return parsedItem;
		} catch (err) {
			throw err;
		}
	}

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

	protected throwError(prop: string) {
		throw new Error(`Failed to parse "${prop}" for ${this.expectedEntityType}`);
	}
}
