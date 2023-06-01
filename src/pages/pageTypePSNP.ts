/** Type of PSNProfiles page. */
export enum PsnpPageType {
	/** Navbar "Home" (`psnprofiles.com/`) */
	Home = 'Home',
	/** Browsing trophy guides (`psnprofiles.com/guides`) */
	Guides = 'Guides',
	/** Search results for trophy guides */
	GuideSearch = 'GuideSearch',
	/** Viewing an individual trophy guide */
	Guide = 'Guide',
	/** Viewing a leaderboard */
	Leaderboard = 'Leaderboard',
	/** Search results for users */
	LeaderboardSearch = 'LeaderboardSearch',
	/** Browsing series */
	SeriesCatalog = 'SeriesCatalog',
	/** Viewing an individual series page */
	SeriesPage = 'SeriesPage',
	/** Browsing games */
	Games = 'Games',
	/** Search results for games */
	GameSearch = 'GameSearch',
	/** Browsing DLCs */
	DLC = 'DLC',
	/** Viewing a game's trophy list */
	GameTrophyList = 'GameTrophyList',
	/** Viewing an individual trophy */
	GameTrophy = 'GameTrophy',
	/** Viewing a game's leaderboard, where users are ranked by completion % */
	GameLeaderboard = 'GameLeaderboard',
	/** Viewing a game's 100% Club */
	Game100Club = 'Game100Club',
	/** Browsing trophies */
	Trophies = 'Trophies',
	/** Search results for trophies */
	TrophySearch = 'TrophySearch',
	/** Gaming Sessions (`psnprofiles.com/sessions`) */
	Sessions = 'Sessions',
	/** A user's PSN Profile
	 *
	 * Excludes subpaths and hashes, like `.../log` or `...#gamelists` */
	Profile = 'Profile',
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
	else if (path === '/games/dlc') return PsnpPageType.DLC;
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

export type PsnpPageWithGames =
	| PsnpPageType.Games
	| PsnpPageType.SeriesCatalog
	| PsnpPageType.GameSearch
	| PsnpPageType.Profile
	| PsnpPageType.SeriesPage
	| PsnpPageType.GameTrophyList;
