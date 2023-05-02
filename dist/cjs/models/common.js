"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PsnpEntity = exports.calculateTrophyPoints = exports.sumTrophyCount = void 0;
/** Given a {@link TrophyCount}, sums the total number of trophies. */
function sumTrophyCount(tc) {
    return tc.bronze + tc.silver + tc.gold + tc.platinum;
}
exports.sumTrophyCount = sumTrophyCount;
/** Given a {@link TrophyCount}, calculates the total point value. */
function calculateTrophyPoints(tc) {
    return tc.bronze * 15 + tc.silver * 30 + tc.gold * 90 + tc.platinum * 300;
}
exports.calculateTrophyPoints = calculateTrophyPoints;
/** Abstract class containing properties and methods applicable to all PSNP entities. */
class PsnpEntity {
    _id;
    name;
    _nameSerialized;
    _imagePath;
    constructor(data) {
        this._id = data._id;
        this.name = data.name;
        this._nameSerialized = data._nameSerialized;
        this._imagePath = data._imagePath;
    }
    toString() {
        return `${this.name} (ID ${this._id})`;
    }
}
exports.PsnpEntity = PsnpEntity;
//# sourceMappingURL=common.js.map