/** Type of PSNProfiles page. */
export enum PsnpForumPageType {
	GameSubforum,
	Topic,
}

/** Identifies the PSNProfiles page type of a given URL. */
export function getPsnpForumPageType(url: URL): PsnpForumPageType {
	const path = url.pathname;

	if (path.startsWith('/forum/')) return PsnpForumPageType.GameSubforum;
	else if (path.startsWith('/topic/')) return PsnpForumPageType.Topic;
	else throw new Error(`Unable to determine page type of '${url.href}'`);
}
