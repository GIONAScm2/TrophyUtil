/** Parses an entity `T` from `E`. */
export declare abstract class PsnpParser<T, E> {
    protected abstract readonly expectedEntityType: string;
    parse(domTarget: E): T;
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
    protected _extractIdAndTitleFromPsnpUrl({ url, index, }: {
        /** The PSNP URL (href or pathname) */
        url: string | null | undefined;
        /** Index of the `.split("/")` pathname where the ID and serialized name are expected */
        index?: 2 | 3;
    }): [number, string] | undefined;
    protected throwError(prop: string): void;
}
//# sourceMappingURL=psnpParser.d.ts.map