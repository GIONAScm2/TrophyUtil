/** Type of PSNProfiles page. */
export var PsnpPageType;
(function (PsnpPageType) {
    /** Navbar "Home" (`psnprofiles.com/`) */
    PsnpPageType["Home"] = "Home";
    /** Browsing trophy guides (`psnprofiles.com/guides`) */
    PsnpPageType["Guides"] = "Guides";
    /** Search results for trophy guides */
    PsnpPageType["GuideSearch"] = "GuideSearch";
    /** Viewing an individual trophy guide */
    PsnpPageType["Guide"] = "Guide";
    /** Viewing a leaderboard */
    PsnpPageType["Leaderboard"] = "Leaderboard";
    /** Search results for users */
    PsnpPageType["LeaderboardSearch"] = "LeaderboardSearch";
    /** Browsing series */
    PsnpPageType["SeriesCatalog"] = "SeriesCatalog";
    /** Viewing an individual series page */
    PsnpPageType["SeriesPage"] = "SeriesPage";
    /** Browsing games */
    PsnpPageType["Games"] = "Games";
    /** Search results for games */
    PsnpPageType["GameSearch"] = "GameSearch";
    /** Browsing DLCs */
    PsnpPageType["DLC"] = "DLC";
    /** Viewing a game's trophy list */
    PsnpPageType["GameTrophyList"] = "GameTrophyList";
    /** Viewing an individual trophy */
    PsnpPageType["GameTrophy"] = "GameTrophy";
    /** Viewing a game's leaderboard, where users are ranked by completion % */
    PsnpPageType["GameLeaderboard"] = "GameLeaderboard";
    /** Viewing a game's 100% Club */
    PsnpPageType["Game100Club"] = "Game100Club";
    /** Browsing trophies */
    PsnpPageType["Trophies"] = "Trophies";
    /** Search results for trophies */
    PsnpPageType["TrophySearch"] = "TrophySearch";
    /** Gaming Sessions (`psnprofiles.com/sessions`) */
    PsnpPageType["Sessions"] = "Sessions";
    /** A user's PSN Profile
     *
     * Excludes subpaths and hashes, like `.../log` or `...#gamelists` */
    PsnpPageType["Profile"] = "Profile";
})(PsnpPageType || (PsnpPageType = {}));
/** Identifies the PSNProfiles page type of a given URL. */
export function getPsnpPageType(url) {
    const path = url.pathname;
    if (path === '/')
        return PsnpPageType.Home;
    else if (path === '/guides')
        return PsnpPageType.Guides;
    else if (path === '/search/guides')
        return PsnpPageType.GuideSearch;
    else if (path.startsWith('/guide/'))
        return PsnpPageType.Guide;
    else if (path.startsWith('/leaderboard'))
        return PsnpPageType.Leaderboard;
    else if (path === '/search/users')
        return PsnpPageType.LeaderboardSearch;
    else if (path === '/series')
        return PsnpPageType.SeriesCatalog;
    else if (path.startsWith('/series/'))
        return PsnpPageType.SeriesPage;
    else if (path === '/games')
        return PsnpPageType.Games;
    else if (path === '/games/dlc')
        return PsnpPageType.DLC;
    else if (path === '/search' || path === '/search/games')
        return PsnpPageType.GameSearch;
    else if (path.startsWith(`/trophies/`))
        return PsnpPageType.GameTrophyList;
    else if (path.startsWith('/trophy/'))
        return PsnpPageType.GameTrophy;
    else if (path.startsWith('/game-leaderboard/'))
        return PsnpPageType.GameLeaderboard;
    else if (path.startsWith('/100-club/'))
        return PsnpPageType.Game100Club;
    else if (path === '/trophies')
        return PsnpPageType.Trophies;
    else if (path === '/search/trophies')
        return PsnpPageType.TrophySearch;
    else if (path === '/sessions')
        return PsnpPageType.Sessions;
    else if (/^\/[^\/]+$/.test(path) && url.hash === '')
        return PsnpPageType.Profile;
    else
        throw new Error(`Unable to determine page type of '${url.href}'`);
}
//# sourceMappingURL=pageTypePSNP.js.map