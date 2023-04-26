import { PsnpEntity } from './common.js';
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
//# sourceMappingURL=series.impl.js.map