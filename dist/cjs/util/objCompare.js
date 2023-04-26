"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.diffAndUpdateSharedProps = exports.updateSharedPropsWithChanges = exports.sharedPropsAreEqual = exports.isStandardObj = void 0;
/** Returns true if `x` is a standard POJO (or class instance), otherwise false if it's a primitive/null/array/function/Map/Set. */
function isStandardObj(x) {
    return Object.prototype.toString.call(x) === '[object Object]';
}
exports.isStandardObj = isStandardObj;
/** Checks whether all shared properties of `a` and `b` are equal. Useful to check whether an object is up-to-date.
 *
 * Object properties are recursed into. Array properties are compared solely on their length.
 *
 * If there are no shared properties, an error is thrown. */
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
/** Finds all shared properties (keys) in `target` and `source` and updates `target` accordingly.
 * Array properties are updated by replacing the entire array if the lengths don't match.
 * Pass `trackChanges` to return a list of changes. */
function updateSharedPropsWithChanges(target, source, trackChanges = false, parentKey = '') {
    const changes = [];
    const sharedKeys = Object.keys(target).filter(key => key in source);
    sharedKeys.forEach(key => {
        const fullKey = parentKey ? `${parentKey}.${key}` : key;
        const sourceVal = source[key];
        const targetVal = target[key];
        if (isStandardObj(sourceVal) && isStandardObj(targetVal)) {
            const subChanges = updateSharedPropsWithChanges(targetVal, sourceVal, trackChanges, fullKey);
            if (trackChanges && subChanges) {
                changes.push(...subChanges);
            }
        }
        else if (Array.isArray(sourceVal) && Array.isArray(targetVal)) {
            if (trackChanges && sourceVal.length !== targetVal.length) {
                changes.push({
                    key: fullKey,
                    oldValue: targetVal.length,
                    newValue: sourceVal.length,
                });
            }
            target[key] = sourceVal.slice();
        }
        else if (sourceVal !== targetVal) {
            if (trackChanges) {
                changes.push({
                    key: fullKey,
                    oldValue: targetVal,
                    newValue: sourceVal,
                });
            }
            target[key] = sourceVal;
        }
    });
    return trackChanges ? changes : undefined;
}
exports.updateSharedPropsWithChanges = updateSharedPropsWithChanges;
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
// /** This function takes two objects, obj1 and obj2, and iterates through their combined set of keys. For each key, it checks if the corresponding values are standard objects, arrays, or other types. If both values are standard objects, it calls itself recursively to find the differences and merges the resulting changes into the main changes array. If both values are arrays, it compares their lengths and adds a change entry if they differ. For other types, it directly compares the values and adds a change entry if they differ.
//  * The parentKey parameter is used to keep track of nested keys during the recursion. */
// export function diffObjects<T extends Record<string, unknown>>(
// 	obj1: T,
// 	obj2: T,
// 	parentKey: string = ''
// ): FieldChanges<T> {
// 	const changes: FieldChanges<T> = [];
// 	const keys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
// 	keys.forEach(key => {
// 		const fullKey = parentKey ? `${parentKey}.${key}` : key;
// 		const val1 = obj1[key as keyof T];
// 		const val2 = obj2[key as keyof T];
// 		if (isStandardObj(val1) && isStandardObj(val2)) {
// 			changes.push(...diffObjects(val1 as T, val2 as T, fullKey));
// 		} else if (Array.isArray(val1) && Array.isArray(val2)) {
// 			if (val1.length !== val2.length) {
// 				changes.push({
// 					key: fullKey as keyof T,
// 					oldValue: val1.length,
// 					newValue: val2.length,
// 				} as ArrayLengthChange<keyof T>);
// 			}
// 		} else if (val1 !== val2) {
// 			changes.push({
// 				key: fullKey as keyof T,
// 				oldValue: val1,
// 				newValue: val2,
// 			});
// 		}
// 	});
// 	return changes;
// }
// /** Updates `target` with shared properties of `source`. Array properties are replaced entirely.  */
// export function updateSharedProps(target: Record<string, unknown>, source: Record<string, unknown>): void {
// 	const sharedKeys = Object.keys(target).filter(key => key in source);
// 	sharedKeys.forEach(key => {
// 		const sourceVal = source[key];
// 		const targetVal = target[key];
// 		if (isStandardObj(sourceVal) && isStandardObj(targetVal)) {
// 			updateSharedProps(targetVal, sourceVal);
// 		} else if (Array.isArray(sourceVal) && Array.isArray(targetVal)) {
// 			target[key] = sourceVal.slice();
// 		} else {
// 			target[key] = sourceVal;
// 		}
// 	});
// }
// Hybrid of the above 2 functions
//# sourceMappingURL=objCompare.js.map