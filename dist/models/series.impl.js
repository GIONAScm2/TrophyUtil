import { PsnpEntity } from './psnpEntity.js';
export class PsnpSeriesListing extends PsnpEntity {
    trophyCount;
    numTrophies;
    numGames;
    points;
    get url() {
        return `https://psnprofiles.com/series/${this._id}-${this._nameSerialized}`;
    }
    get src() {
        return `https://i.psnprofiles.com/series/${this._imagePath}.S.png`;
    }
    constructor(data) {
        super(data);
        this.trophyCount = data.trophyCount;
        this.points = data.points;
        this.numTrophies = data.numTrophies;
        this.numGames = data.numGames;
    }
}
export class SeriesDoc extends PsnpSeriesListing {
    stages;
    createdAt;
    updatedAt;
    /** Flattens `stages` series stages, returning a 2D array of all games. */
    get allGames() {
        return this.stages.flatMap(s => s.gameIds);
    }
    constructor(data) {
        super(data);
        this.stages = data.stages;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }
}
//# sourceMappingURL=series.impl.js.map