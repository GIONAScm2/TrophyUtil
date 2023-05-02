/** Given a {@link TrophyCount}, sums the total number of trophies. */
export function sumTrophyCount(tc) {
    return tc.bronze + tc.silver + tc.gold + tc.platinum;
}
/** Given a {@link TrophyCount}, calculates the total point value. */
export function calculateTrophyPoints(tc) {
    return tc.bronze * 15 + tc.silver * 30 + tc.gold * 90 + tc.platinum * 300;
}
/** Abstract class containing properties and methods applicable to all PSNP entities. */
export class PsnpEntity {
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
//# sourceMappingURL=common.js.map