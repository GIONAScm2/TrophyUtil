"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Select = void 0;
const pageTypePSNP_js_1 = require("../pages/pageTypePSNP.js");
class Select {
    /** Selects all valid table rows. */
    static TR = `tr:not(:empty, [id*='load'])`;
    static tr(parent) {
        return [...parent.querySelectorAll(Select.TR)];
    }
    /** HTMLElement containing max page number. */
    static MAX_PAGE_NUM = `#content ul.pagination:not(.small) > li:nth-last-child(2) > a`;
    /** Selects all trophy nodes from a trophy list. */
    static TROPHY_LIST_TROPHIES = `#content div.col-xs > div.box.no-top-border table:last-of-type ${Select.TR}`;
    static SUFFIX = `tbody > ${Select.TR}`;
    /** Game node selectors based on the page.
     *
     * **Note:** Array values are necessary to replace pseudo-class `:is()` since it's not currently supported by JSDOM. */
    static gameNodes = {
        [pageTypePSNP_js_1.PsnpPageType.Games]: [`#game_list ${Select.SUFFIX}`],
        [pageTypePSNP_js_1.PsnpPageType.SeriesCatalog]: [`#game_list ${Select.SUFFIX}`],
        [pageTypePSNP_js_1.PsnpPageType.GameSearch]: [`#search-results:not([style="display: none;"]) ${Select.SUFFIX}`],
        [pageTypePSNP_js_1.PsnpPageType.Profile]: [
            `#search-results:not([style="display: none;"]) ${Select.SUFFIX}`,
            `#gamesTable:not([style="display: none;"]) ${Select.SUFFIX}`,
        ],
        [pageTypePSNP_js_1.PsnpPageType.SeriesPage]: [`table.series:not(.legend) ${Select.SUFFIX}`],
        /** Cannot select game nodes on its own; must be used after finding the "OTHER PLATFORMS AND REGIONS" section. */
        [pageTypePSNP_js_1.PsnpPageType.GameTrophyList]: [`${Select.SUFFIX}`],
    };
}
exports.Select = Select;
//# sourceMappingURL=Select.js.map