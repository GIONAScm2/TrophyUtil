"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.diffUpdate = exports.diffAndUpdateSharedProps = exports.sharedPropsAreEqual = exports.isStandardObj = void 0;
/** Returns `true` if `x` is a standard POJO (or class instance), otherwise `false` if it's a primitive/null/array/function/Map/Set/etc. */
function isStandardObj(x) {
    return Object.prototype.toString.call(x) === '[object Object]';
}
exports.isStandardObj = isStandardObj;
/** Compares shared properties of `obj1` and `obj2` for relative equality. Primitive values - including nested object properties -
 * must be equal, and array values must have the same length. Returns `null` if no shared properties exist.
 *
 * Useful for verifying if MongoDB documents are up-to-date with freshly-parsed entities. */
function sharedPropsAreEqual(obj1, obj2) {
    const sharedKeys = Object.keys(obj1).filter(key => key in obj2);
    if (sharedKeys.length === 0) {
        return null;
    }
    return sharedKeys.every(key => {
        const val1 = obj1[key];
        const val2 = obj2[key];
        if (isStandardObj(val1) && isStandardObj(val2)) {
            return sharedPropsAreEqual(val1, val2);
        }
        else if (Array.isArray(val1) && Array.isArray(val2)) {
            return val1.length === val2.length;
        }
        else {
            return val1 === val2;
        }
    });
}
exports.sharedPropsAreEqual = sharedPropsAreEqual;
/** Finds all shared properties (keys) between `oldEntity` and `newEntity` and returns an array of changes.
 *  Setting the `update` flag will also update `oldEntity` with the values of properties shared with `newEntity`. */
function diffAndUpdateSharedProps(oldEntity, newEntity, update = false, parentKey = '') {
    const changes = [];
    const sharedKeys = Object.keys(oldEntity).filter(key => key in newEntity);
    sharedKeys.forEach(key => {
        const fullKey = parentKey ? `${parentKey}.${key}` : key;
        const newVal = newEntity[key];
        const oldVal = oldEntity[key];
        if (isStandardObj(newVal) && isStandardObj(oldVal)) {
            const subChanges = diffAndUpdateSharedProps(oldVal, newVal, update, fullKey);
            changes.push(...subChanges);
        }
        else if (Array.isArray(newVal) && Array.isArray(oldVal)) {
            if (newVal.length !== oldVal.length) {
                changes.push({
                    key: fullKey,
                    oldValue: oldVal.length,
                    newValue: newVal.length,
                });
            }
            if (update) {
                oldEntity[key] = newVal.slice();
            }
            // Primitive value change where newVal is not nullish nor an empty string.
        }
        else if ((newVal ?? '') !== '' && newVal !== oldVal) {
            changes.push({
                key: fullKey,
                oldValue: oldVal,
                newValue: newVal,
            });
            if (update) {
                oldEntity[key] = newVal;
            }
        }
    });
    return changes;
}
exports.diffAndUpdateSharedProps = diffAndUpdateSharedProps;
/**
 * Compares `oldEntity` to `newEntity` and returns a log of changes based on their shared properties.
 * The `update` flag will also update `oldEntity` with any differing shared property values.
 *
 * **Note:** "new" operations return an empty `changes` array. */
function diffUpdate(oldEntity, newEntity, update) {
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
exports.diffUpdate = diffUpdate;
//# sourceMappingURL=objCompare.js.map