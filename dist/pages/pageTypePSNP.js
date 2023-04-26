/** Type of PSNProfiles page. */
export var PsnpPageType;
(function (PsnpPageType) {
    /** Navbar "Home" (`psnprofiles.com/`) */
    PsnpPageType[PsnpPageType["Home"] = 0] = "Home";
    /** Browsing trophy guides (`psnprofiles.com/guides`) */
    PsnpPageType[PsnpPageType["Guides"] = 1] = "Guides";
    /** Search results for trophy guides */
    PsnpPageType[PsnpPageType["GuideSearch"] = 2] = "GuideSearch";
    /** Viewing an individual trophy guide */
    PsnpPageType[PsnpPageType["Guide"] = 3] = "Guide";
    /** Viewing a leaderboard */
    PsnpPageType[PsnpPageType["Leaderboard"] = 4] = "Leaderboard";
    /** Search results for users */
    PsnpPageType[PsnpPageType["LeaderboardSearch"] = 5] = "LeaderboardSearch";
    /** Browsing series */
    PsnpPageType[PsnpPageType["SeriesCatalog"] = 6] = "SeriesCatalog";
    /** Viewing an individual series page */
    PsnpPageType[PsnpPageType["SeriesPage"] = 7] = "SeriesPage";
    /** Browsing games */
    PsnpPageType[PsnpPageType["Games"] = 8] = "Games";
    /** Search results for games */
    PsnpPageType[PsnpPageType["GameSearch"] = 9] = "GameSearch";
    /** Viewing a game's trophy list */
    PsnpPageType[PsnpPageType["GameTrophyList"] = 10] = "GameTrophyList";
    /** Viewing an individual trophy */
    PsnpPageType[PsnpPageType["GameTrophy"] = 11] = "GameTrophy";
    /** Viewing a game's leaderboard, where users are ranked by completion % */
    PsnpPageType[PsnpPageType["GameLeaderboard"] = 12] = "GameLeaderboard";
    /** Viewing a game's 100% Club */
    PsnpPageType[PsnpPageType["Game100Club"] = 13] = "Game100Club";
    /** Browsing trophies */
    PsnpPageType[PsnpPageType["Trophies"] = 14] = "Trophies";
    /** Search results for trophies */
    PsnpPageType[PsnpPageType["TrophySearch"] = 15] = "TrophySearch";
    /** Gaming Sessions (`psnprofiles.com/sessions`) */
    PsnpPageType[PsnpPageType["Sessions"] = 16] = "Sessions";
    /** A user's PSN Profile
     *
     * Excludes subpaths and hashes, like `.../log` or `...#gamelists` */
    PsnpPageType[PsnpPageType["Profile"] = 17] = "Profile";
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
/** Returns the stringified {@link PsnpPageType} */
export function getPsnpPageTypeKey(pageType) {
    return (Object.keys(PsnpPageType).find(key => PsnpPageType[key] === pageType) ||
        '');
}
//# sourceMappingURL=pageTypePSNP.js.map