/**
 * Given a trophy count, sums the total number of trophies.
 * @param tc A {@link TrophyCount}
 * @returns Total number of trophies
 */
export declare function sumTrophyCount(tc: TrophyCount): number;
/**
 * Given a trophy count, calculates the total point value.
 * @param tc A {@link TrophyCount}
 * @returns Total number of points
 */ export declare function calculateTrophyPoints(tc: TrophyCount): number;
/** Counts of trophies (`bronze`, `silver`, `gold`, `platinum`). */
export interface TrophyCount {
    bronze: number;
    silver: number;
    gold: number;
    platinum: number;
}
/** Trophy count-related properties (`trophyCount`, `points`, `numTrophies`.). */
export interface ITrophyCount {
    /** The aggregated number of trophies of each grade.
     *
     * For played games, these numbers only reflect *earned* trophies, so exert caution when updating database entities. */
    trophyCount: TrophyCount;
    /** Number of points the game is worth. */
    points: number;
    /** Number of trophies the game has. */
    numTrophies: number;
}
/** Mongoose's automatic timestamps take this form. */
export type MongoDateField = {
    $date: string;
};
/** Represents a Mongoose document with timestamps (`createdAt` and `updatedAt`). */
export interface IMongoTimestamps {
    createdAt: MongoDateField;
    updatedAt: MongoDateField;
}
//# sourceMappingURL=common.d.ts.map