"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPsnpForumPageType = exports.PsnpForumPageType = void 0;
/** Type of PSNProfiles page. */
var PsnpForumPageType;
(function (PsnpForumPageType) {
    PsnpForumPageType[PsnpForumPageType["GameSubforum"] = 0] = "GameSubforum";
    PsnpForumPageType[PsnpForumPageType["Topic"] = 1] = "Topic";
})(PsnpForumPageType || (exports.PsnpForumPageType = PsnpForumPageType = {}));
/** Identifies the PSNProfiles page type of a given URL. */
function getPsnpForumPageType(url) {
    const path = url.pathname;
    if (path.startsWith('/forum/'))
        return PsnpForumPageType.GameSubforum;
    else if (path.startsWith('/topic/'))
        return PsnpForumPageType.Topic;
    else
        throw new Error(`Unable to determine page type of '${url.href}'`);
}
exports.getPsnpForumPageType = getPsnpForumPageType;
//# sourceMappingURL=pageType.js.map