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
export function sumTrophyCount(tc: TrophyCount): number {
	return tc.bronze + tc.silver + tc.gold + tc.platinum;
}

/** Given a {@link TrophyCount}, calculates the total point value. */
export function calculateTrophyPoints(tc: TrophyCount): number {
	return tc.bronze * 15 + tc.silver * 30 + tc.gold * 90 + tc.platinum * 300;
}

/** Mongoose's automatic timestamps take this form. */
export type MongoDateField = {$date: string};
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
export abstract class PsnpEntity implements IPsnpEntity {
	readonly _id: number;
	name: string;
	_nameSerialized: string;
	_imagePath: string;

	/** (Getter) Constructs and returns entity's URL using `_id` and `_nameSerialized`. */
	abstract get url(): string;
	/** (Getter) Constructs and returns entity's image URL using `_imagePath`. */
	abstract get src(): string;

	constructor(data: IPsnpEntity) {
		this._id = data._id;
		this.name = data.name;
		this._nameSerialized = data._nameSerialized;
		this._imagePath = data._imagePath;
	}

	toString() {
		return `${this.name} (ID ${this._id})`;
	}
}