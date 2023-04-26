"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PsnpSeriesListing = void 0;
const common_js_1 = require("./common.js");
class PsnpSeriesListing extends common_js_1.PsnpEntity {
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
//# sourceMappingURL=series.impl.js.map