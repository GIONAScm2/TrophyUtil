import { diffAndUpdateSharedProps } from '../util/objCompare.js';
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
/** Updates fields and returns a log of changes. */
export function diffUpdate(oldEntity, newEntity, update) {
    const commonChanges = { id: newEntity._id, changes: [] };
    if (!oldEntity) {
        return { ...commonChanges, operation: 'add' };
    }
    if (oldEntity._id !== newEntity._id) {
        throw new Error(`ID mismatch: Cannot update entity '${oldEntity.toString()}' using entity '${newEntity.toString()}'`);
    }
    const changes = diffAndUpdateSharedProps(oldEntity, newEntity, update);
    return {
        ...commonChanges,
        operation: 'update',
        changes,
    };
}
//# sourceMappingURL=common.js.map