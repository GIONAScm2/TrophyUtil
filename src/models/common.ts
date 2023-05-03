/**
 * Given a trophy count, sums the total number of trophies.
 * @param tc A {@link TrophyCount}
 * @returns Total number of trophies
 */
export function sumTrophyCount(tc: TrophyCount): number {
	return tc.bronze + tc.silver + tc.gold + tc.platinum;
}

/**
 * Given a trophy count, calculates the total point value.
 * @param tc A {@link TrophyCount}
 * @returns Total number of points
 */ export function calculateTrophyPoints(tc: TrophyCount): number {
	return tc.bronze * 15 + tc.silver * 30 + tc.gold * 90 + tc.platinum * 300;
}

/** Counts of trophies (`bronze`, `silver`, `gold`, `platinum`). */
export interface TrophyCount {
	bronze: number;
	silver: number;
	gold: number;
	platinum: number;
}
/** Trophy count-related properties (`trophyCount`, `points`, `numTrophies`.). */
export interface ITrophyCount {
	/** The aggregated number of trophies of each grade. */
	trophyCount: TrophyCount;
	/** Number of points the game is worth. */
	points: number;
	/** Number of trophies the game has. */
	numTrophies: number;
}

/** Mongoose's automatic timestamps take this form. */
export type MongoDateField = {$date: string};
/** Represents a Mongoose document with timestamps (`createdAt` and `updatedAt`). */
export interface IMongoTimestamps {
	createdAt: MongoDateField;
	updatedAt: MongoDateField;
}
