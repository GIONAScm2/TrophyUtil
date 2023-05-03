"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeriesDoc = exports.PsnpSeriesListing = void 0;
const psnpEntity_js_1 = require("./psnpEntity.js");
class PsnpSeriesListing extends psnpEntity_js_1.PsnpEntity {
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
exports.PsnpSeriesListing = PsnpSeriesListing;
class SeriesDoc extends PsnpSeriesListing {
    stages;
    createdAt;
    updatedAt;
    constructor(data) {
        super(data);
        this.stages = data.stages;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }
    diffUpdate(oldEntity, newEntity, update) {
        return super.diffUpdate(oldEntity, newEntity, update);
    }
}
exports.SeriesDoc = SeriesDoc;
//# sourceMappingURL=series.impl.js.map