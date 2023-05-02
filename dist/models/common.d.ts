/** Counts of bronze, silver, gold, and platinum trophies. */
export interface TrophyCount {
    bronze: number;
    silver: number;
    gold: number;
    platinum: number;
}
/** Object implements  {@link TrophyCount} */
export interface ITrophyCount {
    /** The aggregated number of trophies of each grade. */
    trophyCount: TrophyCount;
}
/** Given a {@link TrophyCount}, sums the total number of trophies. */
export declare function sumTrophyCount(tc: TrophyCount): number;
/** Given a {@link TrophyCount}, calculates the total point value. */
export declare function calculateTrophyPoints(tc: TrophyCount): number;
/** Mongoose's automatic timestamps take this form. */
export type MongoDateField = {
    $date: string;
};
/** Represents MongoDB timestamp fields. */
export interface IMongoTimestamps {
    createdAt: MongoDateField;
    updatedAt: MongoDateField;
}
/** Represents a generic PSNP entity (`_id`, `name`, `_nameSerialized`, `_imagePath`). */
export interface IPsnpEntity {
    /** ID that uniquely identifies the entity on PSNP. */
    _id: number;
    /** Name of entity. */
    name: string;
    /** URL-serialized name (e.g. `the-witcher-3`) used to construct entity's URL. */
    _nameSerialized: string;
    /** URL fragment used to construct the full `src` URL of the entity's image.
     *
     * For games, size is 100x100 for PS5 games and 100x56 for other platforms. */
    _imagePath: string;
}
/** Abstract class containing properties and methods applicable to all PSNP entities. */
export declare abstract class PsnpEntity implements IPsnpEntity {
    readonly _id: number;
    name: string;
    _nameSerialized: string;
    _imagePath: string;
    /** (Getter) Constructs and returns entity's URL using `_id` and `_nameSerialized`. */
    abstract get url(): string;
    /** (Getter) Constructs and returns entity's image URL using `_imagePath`. */
    abstract get src(): string;
    constructor(data: IPsnpEntity);
    toString(): string;
}
//# sourceMappingURL=common.d.ts.map