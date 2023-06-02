/** Type of PSNProfiles page. */
export var TTAPageType;
(function (TTAPageType) {
    TTAPageType[TTAPageType["GameAchievements"] = 0] = "GameAchievements";
    TTAPageType[TTAPageType["GameAchievementSolutions"] = 1] = "GameAchievementSolutions";
    TTAPageType[TTAPageType["Walkthrough"] = 2] = "Walkthrough";
})(TTAPageType || (TTAPageType = {}));
/** Identifies the PSNProfiles page type of a given URL. */
export function getTTAPageType(url) {
    const path = url.pathname;
    if (/^\/game\/[^\/]+?\/(achievements|trophies)$/.test(path))
        return TTAPageType.GameAchievements;
    else if (/^\/(a|t)\d+?\/.+?-(achievement|trophy)$/)
        return TTAPageType.GameAchievementSolutions;
    else if (/^\/game\/[^\/]+?\/walkthrough(\/\d*)?$/.test(path))
        return TTAPageType.Walkthrough;
    else
        throw new Error(`Unable to determine page type of '${url.href}'`);
}
//# sourceMappingURL=pageType.js.map