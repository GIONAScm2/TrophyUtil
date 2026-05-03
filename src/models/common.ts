/** Counts trophies by PSN trophy grade. */
export interface TrophyCount {
	bronze: number;
	silver: number;
	gold: number;
	platinum: number;
}

/** Data derived from a trophy count. */
export interface TrophyCountFields {
	trophyCount: TrophyCount;
	points: number;
	numTrophies: number;
}

export function createEmptyTrophyCount(): TrophyCount {
	return { bronze: 0, silver: 0, gold: 0, platinum: 0 };
}

export function sumTrophyCount(trophyCount: TrophyCount): number {
	return trophyCount.bronze + trophyCount.silver + trophyCount.gold + trophyCount.platinum;
}

export function calculateTrophyPoints(trophyCount: TrophyCount): number {
	return trophyCount.bronze * 15 + trophyCount.silver * 30 + trophyCount.gold * 90 + trophyCount.platinum * 300;
}
