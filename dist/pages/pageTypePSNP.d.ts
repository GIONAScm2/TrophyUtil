/** Type of PSNProfiles page. */
export declare enum PsnpPageType {
    /** Navbar "Home" (`psnprofiles.com/`) */
    Home = 0,
    /** Browsing trophy guides (`psnprofiles.com/guides`) */
    Guides = 1,
    /** Search results for trophy guides */
    GuideSearch = 2,
    /** Viewing an individual trophy guide */
    Guide = 3,
    /** Viewing a leaderboard */
    Leaderboard = 4,
    /** Search results for users */
    LeaderboardSearch = 5,
    /** Browsing series */
    SeriesCatalog = 6,
    /** Viewing an individual series page */
    SeriesPage = 7,
    /** Browsing games */
    Games = 8,
    /** Search results for games */
    GameSearch = 9,
    /** Viewing a game's trophy list */
    GameTrophyList = 10,
    /** Viewing an individual trophy */
    GameTrophy = 11,
    /** Viewing a game's leaderboard, where users are ranked by completion % */
    GameLeaderboard = 12,
    /** Viewing a game's 100% Club */
    Game100Club = 13,
    /** Browsing trophies */
    Trophies = 14,
    /** Search results for trophies */
    TrophySearch = 15,
    /** Gaming Sessions (`psnprofiles.com/sessions`) */
    Sessions = 16,
    /** A user's PSN Profile
     *
     * Excludes subpaths and hashes, like `.../log` or `...#gamelists` */
    Profile = 17
}
/** Identifies the PSNProfiles page type of a given URL. */
export declare function getPsnpPageType(url: URL): PsnpPageType;
/** Returns the stringified {@link PsnpPageType} */
export declare function getPsnpPageTypeKey(pageType: PsnpPageType): string;
export type PsnpPageWithGames = PsnpPageType.Games | PsnpPageType.SeriesCatalog | PsnpPageType.GameSearch | PsnpPageType.Profile | PsnpPageType.SeriesPage | PsnpPageType.GameTrophyList;
//# sourceMappingURL=pageTypePSNP.d.ts.map