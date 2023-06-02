/** Type of PSNProfiles page. */
export var PsnpForumPageType;
(function (PsnpForumPageType) {
    PsnpForumPageType[PsnpForumPageType["GameSubforum"] = 0] = "GameSubforum";
    PsnpForumPageType[PsnpForumPageType["Topic"] = 1] = "Topic";
})(PsnpForumPageType || (PsnpForumPageType = {}));
/** Identifies the PSNProfiles page type of a given URL. */
export function getPsnpForumPageType(url) {
    const path = url.pathname;
    if (path.startsWith('/forum/'))
        return PsnpForumPageType.GameSubforum;
    else if (path.startsWith('/topic/'))
        return PsnpForumPageType.Topic;
    else
        throw new Error(`Unable to determine page type of '${url.href}'`);
}
//# sourceMappingURL=pageType.js.map