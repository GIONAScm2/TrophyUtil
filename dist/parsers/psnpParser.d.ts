import { TrophyCount } from '../models/index.js';
/** Parses a `T` from `E`. */
export declare abstract class PsnpParser<T, E> {
    /** Entity identifier to aid subclass debugging. */
    protected abstract readonly type: string;
    parse(domTarget: E): T;
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
//# sourceMappingURL=psnpParser.d.ts.map