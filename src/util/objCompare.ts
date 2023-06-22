import {type IPsnpEntity} from '../models/psnpEntity.js';

/** Returns `true` if `x` is a standard POJO (or class instance), otherwise `false` if it's a primitive/null/array/function/Map/Set/etc. */
export function isStandardObj(x: unknown): x is Record<string, unknown> {
	return Object.prototype.toString.call(x) === '[object Object]';
}

/** Compares shared properties of `obj1` and `obj2` for relative equality. Primitive values - including nested object properties -
 * must be equal, and array values must have the same length. Returns `null` if no shared properties exist.
 *
 * Useful for verifying if MongoDB documents are up-to-date with freshly-parsed entities. */
export function sharedPropsAreEqual(obj1: Record<string, unknown>, obj2: Record<string, unknown>): boolean | null {
	const sharedKeys = Object.keys(obj1).filter(key => key in obj2);
	if (sharedKeys.length === 0) {
		return null;
	}

	return sharedKeys.every(key => {
		const val1 = obj1[key];
		const val2 = obj2[key];

		if (isStandardObj(val1) && isStandardObj(val2)) {
			return sharedPropsAreEqual(val1, val2);
		} else if (Array.isArray(val1) && Array.isArray(val2)) {
			return val1.length === val2.length;
		} else {
			return val1 === val2;
		}
	});
}

/** Represents an object key's change in value. */
export type FieldChange = {
	key: string;
	oldValue: unknown;
	newValue: unknown;
};
/** Represents an object key's change in value length, when the value is an array. */
export type ArrayLengthChange = {
	key: string;
	oldValue: number;
	newValue: number;
};

/** An array of {@link FieldChange} and/or {@link ArrayLengthChange} */
export type FieldChanges = (FieldChange | ArrayLengthChange)[];

/** Represents the aggregate change of an object. */
export type ChangeData = {
	id: number;
	operation: 'add' | 'update';
	changes: FieldChanges;
};

/** Finds all shared properties (keys) between `oldEntity` and `newEntity` and returns an array of changes.
 *  Setting the `update` flag will also update `oldEntity` with the values of properties shared with `newEntity`. */
export function diffAndUpdateSharedProps<T extends object>(
	oldEntity: Partial<T>,
	newEntity: Partial<T>,
	update: boolean = false,
	parentKey: string = ''
): FieldChanges {
	const changes: FieldChanges = [];

	const sharedKeys = Object.keys(oldEntity).filter(key => key in newEntity);

	sharedKeys.forEach(key => {
		const fullKey = parentKey ? `${parentKey}.${key}` : key;
		const newVal = newEntity[key as keyof T];
		const oldVal = oldEntity[key as keyof T];

		if (isStandardObj(newVal) && isStandardObj(oldVal)) {
			const subChanges = diffAndUpdateSharedProps(oldVal, newVal, update, fullKey);
			changes.push(...(subChanges as FieldChanges));
		} else if (Array.isArray(newVal) && Array.isArray(oldVal)) {
			if (newVal.length !== oldVal.length) {
				changes.push({
					key: fullKey as keyof T,
					oldValue: oldVal.length,
					newValue: newVal.length,
				} as ArrayLengthChange);
			}
			if (update) {
				oldEntity[key as keyof T] = newVal.slice() as T[keyof T];
			}
			// Primitive value change where newVal is not nullish nor an empty string.
		} else if ((newVal ?? '') !== '' && newVal !== oldVal) {
			changes.push({
				key: fullKey as Extract<keyof T, string>,
				oldValue: oldVal,
				newValue: newVal,
			} as FieldChange);
			if (update) {
				oldEntity[key as keyof T] = newVal as T[keyof T];
			}
		}
	});

	return changes;
}

/**
 * Compares `oldEntity` to `newEntity` and returns a log of changes based on their shared properties.
 * The `update` flag will also update `oldEntity` with any differing shared property values.
 *
 * **Note:** "new" operations return an empty `changes` array. */
export function diffUpdate<E extends IPsnpEntity>(oldEntity: E | null | undefined, newEntity: E, update: boolean): ChangeData {
	const commonChanges = {id: newEntity._id, changes: []};

	if (!oldEntity) {
		return {...commonChanges, operation: 'add'};
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

/**
 * Removes extraneous properties from `target` that don't exist on `exemplar`.
 * This includes properties nested within objects.
 * Outputs log for every omitted property.
 *
 * @param {Record<string, unknown>} exemplar - The object that holds the desired structure.
 * @param {unknown} target - The object from which extraneous properties are to be pruned.
 * @returns {Record<string, unknown> | null} - The pruned object, or null if the target wasn't an object.
 */
export function pruneExtraneousProperties(exemplar: Record<string, unknown>, target: unknown): Record<string, unknown> | null {
	if (!isStandardObj(target)) {
		return null;
	}

	const result: Record<string, unknown> = {};

	Object.keys(target).forEach(key => {
		if (key in exemplar) {
			const exemplarVal = exemplar[key];
			const targetVal = target[key];
			if (isStandardObj(targetVal) && isStandardObj(exemplarVal)) {
				result[key] = pruneExtraneousProperties(exemplarVal, targetVal);
			} else {
				result[key] = targetVal;
			}
		} else {
			console.log(`Omitting deprecated key '${key}'`);
		}
	});

	return result;
}
