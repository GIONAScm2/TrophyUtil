"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PsnpEntity = void 0;
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