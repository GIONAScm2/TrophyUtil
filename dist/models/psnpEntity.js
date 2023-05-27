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
        return `${this.name} (${this._id})`;
    }
}
//# sourceMappingURL=psnpEntity.js.map