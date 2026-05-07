export type PsnpEntityUrlParts = {
	id: number;
	slug: string;
};

export function parsePsnpEntityUrl(url: string | null | undefined, index: 2 | 3 = 2): PsnpEntityUrlParts | null {
	if (!url) return null;

	const segment = toPathname(url).split('/').at(index);
	if (!segment) return null;

	const [idText, ...slugParts] = segment.split('-');
	const id = Number.parseInt(idText ?? '', 10);
	const slug = slugParts.join('-');

	if (!Number.isSafeInteger(id) || id <= 0 || !slug) {
		return null;
	}

	return { id, slug };
}

function toPathname(url: string): string {
	if (url.startsWith('http://') || url.startsWith('https://')) {
		return new URL(url).pathname;
	}
	return url;
}
