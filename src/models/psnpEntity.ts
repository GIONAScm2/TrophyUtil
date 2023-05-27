import {diffAndUpdateSharedProps, type ChangeData} from '../util/objCompare.js';

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
export abstract class PsnpEntity<T extends IPsnpEntity> implements IPsnpEntity {
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
		return `${this.name} (${this._id})`;
	}
}

