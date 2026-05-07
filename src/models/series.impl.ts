import { PsnpEntity } from './psnpEntity.js';
import type { TrophyCount } from './common.js';
import type { SeriesPage, SeriesListing, Stage } from './series.interface.js';

export class PsnpSeriesListing extends PsnpEntity implements SeriesListing {
	trophyCount: TrophyCount;
	numTrophies: number;
	numGames: number;
	points: number;

	override get url(): string {
		return `https://psnprofiles.com/series/${this.id}-${this.slug}`;
	}
	override get src(): string {
		return `https://i.psnprofiles.com/series/${this.imagePath}.S.png`;
	}

	constructor(data: SeriesListing) {
		super(data);
		this.trophyCount = data.trophyCount;
		this.points = data.points;
		this.numTrophies = data.numTrophies;
		this.numGames = data.numGames;
	}
}

export class PsnpSeriesPage extends PsnpSeriesListing implements SeriesPage {
	stages: Stage[];

	get allGames(): number[] {
		return this.stages.flatMap(s => s.gameIds);
	}

	constructor(data: SeriesPage) {
		super(data);
		this.stages = data.stages;
	}
}
