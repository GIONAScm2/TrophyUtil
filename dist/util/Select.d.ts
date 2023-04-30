export declare class Select {
    /** Selects all valid table rows. */
    static readonly TR = "tr:not(:empty, [id*='load'])";
    static tr(parent: Document | HTMLElement): HTMLTableRowElement[];
    /** HTMLElement containing max page number. */
    static readonly MAX_PAGE_NUM = "#content ul.pagination:not(.small) > li:nth-last-child(2) > a";
    /** Selects all trophy nodes from a trophy list. */
    static readonly TROPHY_LIST_TROPHIES: "#content div.col-xs > div.box.no-top-border table:last-of-type tr:not(:empty, [id*='load'])";
    private static readonly SUFFIX;
    /** Game node selectors based on the page.
     *
     * **Note:** Array values are necessary to replace pseudo-class `:is()` since it's not currently supported by JSDOM. */
    static gameNodes: {
        6: string[];
        7: string[];
        8: string[];
        9: string[];
        10: string[];
        17: string[];
    };
}
//# sourceMappingURL=Select.d.ts.map