import { parseNum } from '../util/util.js';
/** Parses a `T` from `E`. */
export class PsnpParser {
    parse(domTarget) {
        const parsedItem = this._parse(domTarget);
        if (!parsedItem) {
            throw new Error(`Failed to parse ${this.type}`);
        }
        return parsedItem;
    }
    /**
     * Given a PSNP URL pathname, returns a tuple of the entity ID and serialized name.
     *
     * @returns {[number, string]|undefined} A tuple containing the extracted entity ID and serialized name, or `undefined` if extraction fails.
     *
     * @example <caption>By default, an `index` of 2 is passed:</caption>
     * _extractIdAndTitleFromPathname({pathname: "/series/234-rock-band"});
     * // Output: [234, "rock-band"]

     * @example <caption>Passing `index` explicitly:</caption>
     * _extractIdAndTitleFromPathname({pathname: "/trophy/3-call-of-duty/1-the-end-of-war", index: 3});
     * // Output: [1, "the-end-of-war"]
     */
    _extractIdAndTitleFromPathname({ pathname, index = 2, }) {
        const parts = pathname?.split('/').at(index)?.split('-');
        if (!parts || parts.length < 2)
            return;
        const id = +parts[0];
        const nameSerialized = parts.slice(1).join('-');
        return [id, nameSerialized];
    }
    parseTrophyCount(tr, isHomeOrGameSearch = false) {
        const suffix = isHomeOrGameSearch ? '.icon-sprite' : '.icon-sprite + span';
        const bronze = parseNum(tr.querySelector(`.bronze${suffix}`));
        const silver = parseNum(tr.querySelector(`.silver${suffix}`));
        const gold = parseNum(tr.querySelector(`.gold${suffix}`));
        if (Number.isNaN(bronze + silver + gold)) {
            return null;
        }
        const platCount = parseNum(tr.querySelector(`.platinum${suffix}`));
        const platinum = Number.isNaN(platCount) ? 0 : platCount;
        return { bronze, silver, gold, platinum };
    }
}
//# sourceMappingURL=psnpParser.js.map