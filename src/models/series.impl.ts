import {PsnpEntity} from './psnpEntity.js';
import {MongoDateField, TrophyCount} from './common.js';
import {ISeriesDoc, ISeriesListing, IStage} from './series.interface.js';

export class PsnpSeriesListing extends PsnpEntity implements ISeriesListing {
	trophyCount: TrophyCount;
	numTrophies: number;
	numGames: number;
	points: number;

	get url() {
		return `https://psnprofiles.com/series/${this._id}-${this._nameSerialized}`;
	}
	get src() {
		return `https://i.psnprofiles.com/series/${this._imagePath}.S.png`;
	}

	constructor(data: ISeriesListing) {
		super(data);
		this.trophyCount = data.trophyCount;
		this.points = data.points;
		this.numTrophies = data.numTrophies;
		this.numGames = data.numGames;
	}
}

export class SeriesDoc extends PsnpSeriesListing implements ISeriesDoc {
	stages: IStage[];
	createdAt?: MongoDateField | undefined;
	updatedAt?: MongoDateField | undefined;

	/** Flattens `stages` series stages, returning a 2D array of all games. */
	get allGames() {
		return this.stages.flatMap(s => s.gameIds);
	}

	constructor(data: ISeriesDoc) {
		super(data);
		this.stages = data.stages;
		this.createdAt = data.createdAt;
		this.updatedAt = data.updatedAt;
	}
}
