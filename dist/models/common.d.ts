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
export type MongoDateField = {
    $date: string;
};
/** Represents MongoDB timestamp fields. */
export interface MongoTimestamps {
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
     * For games, size is 100x100 for PS5 games, and 100x56 for other platforms. */
    _imagePath: string;
}
export declare abstract class PsnpEntity implements IPsnpEntity {
    readonly _id: number;
    name: string;
    _nameSerialized: string;
    _imagePath: string;
    /** (Getter) Constructs and returns entity URL using `_id` and `_nameSerialized`. */
    abstract get url(): string;
    /** (Getter) Constructs and returns entity image URL using `_imagePath`. */
    abstract get src(): string;
    constructor(data: IPsnpEntity);
    toString(): string;
}
//# sourceMappingURL=common.d.ts.map