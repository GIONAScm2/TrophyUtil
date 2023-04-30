import { TrophyCount } from '../models/index.js';
/** Parses an entity `T` from `E`. */
export declare abstract class PsnpParser<T, E> {
    /** Entity identifier to aid subclass debugging. */
    protected abstract readonly type: string;
    /** Parses an entity from a DOM target (Document or Element).
     *
     * @throws If any of the entity's required fields are parsed as `null`.	*/
    parse(domTarget: E): T;
    /** Method that performs the parsing. */
    protected abstract _parse(parseTarget: E): T | null;
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
    protected _extractIdAndTitleFromPathname({ pathname, index, }: {
        /** The PSNP URL pathname */
        pathname: string | null | undefined;
        /** Index of the `.split("/")` pathname where the ID and serialized name are expected */
        index?: 2 | 3;
    }): [number, string] | undefined;
    protected parseTrophyCount(tr: HTMLTableRowElement, isHomeOrGameSearch?: boolean): TrophyCount | null;
}
//# sourceMappingURL=PsnpParser.d.ts.map