/** Type of PSNProfiles page. */
export enum PsnpPageType {
	/** Navbar "Home" (`psnprofiles.com/`) */
	Home,
	/** Browsing trophy guides (`psnprofiles.com/guides`) */
	Guides,
	/** Search results for trophy guides */
	GuideSearch,
	/** Viewing an individual trophy guide */
	Guide,
	/** Viewing a leaderboard */
	Leaderboard,
	/** Search results for users */
	LeaderboardSearch,
	/** Browsing series */
	SeriesCatalog,
	/** Viewing an individual series page */
	SeriesPage,
	/** Browsing games */
	Games,
	/** Search results for games */
	GameSearch,
	/** Viewing a game's trophy list */
	GameTrophyList,
	/** Viewing an individual trophy */
	GameTrophy,
	/** Viewing a game's leaderboard, where users are ranked by completion % */
	GameLeaderboard,
	/** Viewing a game's 100% Club */
	Game100Club,
	/** Browsing trophies */
	Trophies,
	/** Search results for trophies */
	TrophySearch,
	/** Gaming Sessions (`psnprofiles.com/sessions`) */
	Sessions,
	/** A user's PSN Profile
	 *
	 * Excludes subpaths and hashes, like `.../log` or `...#gamelists` */
	Profile,
}

/** Identifies the PSNProfiles page type of a given URL. */
export function getPsnpPageType(url: URL): PsnpPageType {
	const path = url.pathname;

	if (path === '/') return PsnpPageType.Home;
	else if (path === '/guides') return PsnpPageType.Guides;
	else if (path === '/search/guides') return PsnpPageType.GuideSearch;
	else if (path.startsWith('/guide/')) return PsnpPageType.Guide;
	else if (path.startsWith('/leaderboard')) return PsnpPageType.Leaderboard;
	else if (path === '/search/users') return PsnpPageType.LeaderboardSearch;
	else if (path === '/series') return PsnpPageType.SeriesCatalog;
	else if (path.startsWith('/series/')) return PsnpPageType.SeriesPage;
	else if (path === '/games') return PsnpPageType.Games;
	else if (path === '/search' || path === '/search/games') return PsnpPageType.GameSearch;
	else if (path.startsWith(`/trophies/`)) return PsnpPageType.GameTrophyList;
	else if (path.startsWith('/trophy/')) return PsnpPageType.GameTrophy;
	else if (path.startsWith('/game-leaderboard/')) return PsnpPageType.GameLeaderboard;
	else if (path.startsWith('/100-club/')) return PsnpPageType.Game100Club;
	else if (path === '/trophies') return PsnpPageType.Trophies;
	else if (path === '/search/trophies') return PsnpPageType.TrophySearch;
	else if (path === '/sessions') return PsnpPageType.Sessions;
	else if (/^\/[^\/]+$/.test(path) && url.hash === '') return PsnpPageType.Profile;
	else throw new Error(`Unable to determine page type of '${url.href}'`);
}

/** Returns the stringified {@link PsnpPageType} */
export function getPsnpPageTypeKey(pageType: PsnpPageType): string {
	return (
		(Object.keys(PsnpPageType) as Array<keyof typeof PsnpPageType>).find(key => PsnpPageType[key] === pageType) ||
		''
	);
}

export type PsnpPageWithGames =
	| PsnpPageType.Games
	| PsnpPageType.SeriesCatalog
	| PsnpPageType.GameSearch
	| PsnpPageType.Profile
	| PsnpPageType.SeriesPage
	| PsnpPageType.GameTrophyList;
