"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PsnpParser = void 0;
/** Parses an entity `T` from `E`. */
class PsnpParser {
    parse(domTarget) {
        try {
            const parsedItem = this._parse(domTarget);
            if (!parsedItem) {
                throw new Error(`Failed to parse ${this.expectedEntityType}`);
            }
            return parsedItem;
        }
        catch (err) {
            throw err;
        }
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
    throwError(prop) {
        throw new Error(`Failed to parse "${prop}" for ${this.expectedEntityType}`);
    }
}
exports.PsnpParser = PsnpParser;
//# sourceMappingURL=psnpParser.js.map