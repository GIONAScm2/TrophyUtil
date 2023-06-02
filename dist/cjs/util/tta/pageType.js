"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTTAPageType = exports.TTAPageType = void 0;
/** Type of PSNProfiles page. */
var TTAPageType;
(function (TTAPageType) {
    TTAPageType[TTAPageType["GameAchievements"] = 0] = "GameAchievements";
    TTAPageType[TTAPageType["GameAchievementSolutions"] = 1] = "GameAchievementSolutions";
    TTAPageType[TTAPageType["Walkthrough"] = 2] = "Walkthrough";
})(TTAPageType = exports.TTAPageType || (exports.TTAPageType = {}));
/** Identifies the PSNProfiles page type of a given URL. */
function getTTAPageType(url) {
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
exports.getTTAPageType = getTTAPageType;
//# sourceMappingURL=pageType.js.map