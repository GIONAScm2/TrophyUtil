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
/** Finds all shared properties (keys) between `target` and `source` and returns an array of changes.
 *  Setting the `update` flag will also update the shared properties of `source` accordingly. */
function diffAndUpdateSharedProps(target, source, update = false, parentKey = '') {
    const changes = [];
    const sharedKeys = Object.keys(target).filter(key => key in source);
    sharedKeys.forEach(key => {
        const fullKey = parentKey ? `${parentKey}.${key}` : key;
        const sourceVal = source[key];
        const targetVal = target[key];
        if (isStandardObj(sourceVal) && isStandardObj(targetVal)) {
            const subChanges = diffAndUpdateSharedProps(targetVal, sourceVal, update, fullKey);
            if (subChanges) {
                changes.push(...subChanges);
            }
        }
        else if (Array.isArray(sourceVal) && Array.isArray(targetVal)) {
            if (sourceVal.length !== targetVal.length) {
                changes.push({
                    key: fullKey,
                    oldValue: targetVal.length,
                    newValue: sourceVal.length,
                });
            }
            if (update) {
                target[key] = sourceVal.slice();
            }
        }
        else if (sourceVal !== targetVal) {
            changes.push({
                key: fullKey,
                oldValue: targetVal,
                newValue: sourceVal,
            });
            if (update) {
                target[key] = sourceVal;
            }
        }
    });
    return changes;
}
exports.diffAndUpdateSharedProps = diffAndUpdateSharedProps;
/** Updates `oldEntity` with shared properties of `newEntity` and returns the {@link ChangeData}. */
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