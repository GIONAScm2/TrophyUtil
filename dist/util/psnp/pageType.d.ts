/** Type of PSNProfiles page. */
export declare enum PsnpPageType {
    /** Navbar "Home" (`psnprofiles.com/`) */
    Home = "Home",
    /** Browsing trophy guides (`psnprofiles.com/guides`) */
    Guides = "Guides",
    /** Search results for trophy guides */
    GuideSearch = "GuideSearch",
    /** Viewing an individual trophy guide */
    Guide = "Guide",
    /** Viewing a leaderboard */
    Leaderboard = "Leaderboard",
    /** Search results for users */
    LeaderboardSearch = "LeaderboardSearch",
    /** Browsing series */
    SeriesCatalog = "SeriesCatalog",
    /** Viewing an individual series page */
    SeriesPage = "SeriesPage",
    /** Browsing games */
    Games = "Games",
    /** Search results for games */
    GameSearch = "GameSearch",
    /** Browsing DLCs */
    DLC = "DLC",
    /** Viewing a game's trophy list */
    GameTrophyList = "GameTrophyList",
    /** Viewing an individual trophy */
    GameTrophy = "GameTrophy",
    /** Viewing a game's leaderboard, where users are ranked by completion % */
    GameLeaderboard = "GameLeaderboard",
    /** Viewing a game's 100% Club */
    Game100Club = "Game100Club",
    /** Browsing trophies */
    Trophies = "Trophies",
    /** Search results for trophies */
    TrophySearch = "TrophySearch",
    /** Gaming Sessions (`psnprofiles.com/sessions`) */
    Sessions = "Sessions",
    /** A user's PSN Profile
     *
     * Excludes subpaths and hashes, like `.../log` or `...#gamelists` */
    Profile = "Profile"
}
/** Identifies the PSNProfiles page type of a given URL. */
export declare function getPsnpPageType(url: URL): PsnpPageType;
export type PsnpPageWithGames = PsnpPageType.Games | PsnpPageType.SeriesCatalog | PsnpPageType.GameSearch | PsnpPageType.Profile | PsnpPageType.SeriesPage | PsnpPageType.GameTrophyList;
//# sourceMappingURL=pageType.d.ts.map