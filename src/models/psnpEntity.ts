/** Shared data for entities that are addressable on PSNProfiles. */
export interface PsnpEntityData {
	/** Numeric identifier used by PSNProfiles URLs. */
	id: number;
	name: string;
	/** URL slug, such as `the-witcher-3`. */
	slug: string;
	/** Image path fragment used to construct full PSNProfiles image URLs. */
	imagePath: string;
}

/** Base class for PSNProfiles entity models. */
export abstract class PsnpEntity implements PsnpEntityData {
	readonly id: number;
	name: string;
	slug: string;
	imagePath: string;

	abstract get url(): string;
	abstract get src(): string;

	constructor(data: PsnpEntityData) {
		this.id = data.id;
		this.name = data.name;
		this.slug = data.slug;
		this.imagePath = data.imagePath;
	}

	toString(): string {
		return `${this.name} (${this.id})`;
	}
}
