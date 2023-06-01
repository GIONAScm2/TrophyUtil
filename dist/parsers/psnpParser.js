/** Parses an entity `T` from `E`. */
export class PsnpParser {
    /** Parses an entity from a DOM target (Document or Element).
     *
     * @throws If any of the entity's required fields are parsed as `null`.	*/
    parse(domTarget) {
        const parsedItem = this._parse(domTarget);
        if (!parsedItem) {
            throw new Error(`Failed to parse ${this.type}`);
        }
        return parsedItem;
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
    _extractIdAndTitleFromPsnpUrl({ url, index = 2, }) {
        if (!url)
            return;
        // Remove protocol and domain if present
        const pathname = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n]+)/, '');
        const parts = pathname?.split('/').at(index)?.split('-');
        if (!parts || parts.length < 2)
            return;
        const id = +parts[0];
        const nameSerialized = parts.slice(1).join('-');
        return [id, nameSerialized];
    }
}
//# sourceMappingURL=psnpParser.js.map