import {TrophyCount, PsnpEntity} from './common.js';
import {ISeriesListing} from './series.interface.js';

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
