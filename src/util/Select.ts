import {PsnpPageType as Page, PsnpPageWithGames} from '../pages/pageTypePSNP.js';

export class Select {
	/** Selects all valid table rows. */
	static readonly TR = `tr:not(:empty, [id*='load'])`;
	static tr(parent: Document | HTMLElement) {
		return [...parent.querySelectorAll<HTMLTableRowElement>(Select.TR)];
	}
	/** HTMLElement containing max page number. */
	static readonly MAX_PAGE_NUM = `#content ul.pagination:not(.small) > li:nth-last-child(2) > a`;

	/** Selects all trophy nodes from a trophy list. */
	static readonly TROPHY_LIST_TROPHIES =
		`#content div.col-xs > div.box.no-top-border table:last-of-type ${Select.TR}` as const;

	private static readonly SUFFIX = `tbody > ${Select.TR}`;
	/** Game node selectors based on the page.
	 *
	 * **Note:** Array values are necessary to replace pseudo-class `:is()` since it's not currently supported by JSDOM. */
	static gameNodes = {
		[Page.Games]: [`#game_list ${Select.SUFFIX}`],
		[Page.SeriesCatalog]: [`#game_list ${Select.SUFFIX}`],
		[Page.GameSearch]: [`#search-results:not([style="display: none;"]) ${Select.SUFFIX}`],
		[Page.Profile]: [
			`#search-results:not([style="display: none;"]) ${Select.SUFFIX}`,
			`#gamesTable:not([style="display: none;"]) ${Select.SUFFIX}`,
		],
		[Page.SeriesPage]: [`table.series:not(.legend) ${Select.SUFFIX}`],
		/** Cannot select game nodes on its own; must be used after finding the "OTHER PLATFORMS AND REGIONS" section. */
		[Page.GameTrophyList]: [`${Select.SUFFIX}`],
	} as {[key in PsnpPageWithGames]: string[]};
}
