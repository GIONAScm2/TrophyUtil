"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.diffUpdate = exports.PsnpEntity = void 0;
const objCompare_js_1 = require("../util/objCompare.js");
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
/** Updates fields and returns a log of changes. */
function diffUpdate(oldEntity, newEntity, update) {
    const commonChanges = { id: newEntity._id, changes: [] };
    if (!oldEntity) {
        return { ...commonChanges, operation: 'add' };
    }
    if (oldEntity._id !== newEntity._id) {
        throw new Error(`ID mismatch: Cannot update entity '${oldEntity.toString()}' using entity '${newEntity.toString()}'`);
    }
    const changes = (0, objCompare_js_1.diffAndUpdateSharedProps)(oldEntity, newEntity, update);
    return {
        ...commonChanges,
        operation: 'update',
        changes,
    };
}
exports.diffUpdate = diffUpdate;
//# sourceMappingURL=common.js.map