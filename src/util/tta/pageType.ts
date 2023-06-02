/** Type of PSNProfiles page. */
export enum TTAPageType {
	GameAchievements,
	GameAchievementSolutions,
	Walkthrough,
}

/** Identifies the PSNProfiles page type of a given URL. */
export function getTTAPageType(url: URL): TTAPageType {
	const path = url.pathname;

	if (/^\/game\/[^\/]+?\/(achievements|trophies)$/.test(path)) return TTAPageType.GameAchievements;
	else if (/^\/(a|t)\d+?\/.+?-(achievement|trophy)$/) return TTAPageType.GameAchievementSolutions;
	else if (/^\/game\/[^\/]+?\/walkthrough(\/\d*)?$/.test(path)) return TTAPageType.Walkthrough;
	else throw new Error(`Unable to determine page type of '${url.href}'`);
}
