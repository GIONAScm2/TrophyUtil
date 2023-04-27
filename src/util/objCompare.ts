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
export type FieldChange<T, K extends keyof T> = {
	key: string;
	oldValue: T[K] | undefined;
	newValue: T[K] | undefined;
};
/** Represents an object key's change in value length, when the value is an array. */
export type ArrayLengthChange<K extends string> = {
	key: K;
	oldValue: number;
	newValue: number;
};

/** An array of {@link FieldChange} and/or {@link ArrayLengthChange} */
export type FieldChanges<T, K extends Extract<keyof T, string> = Extract<keyof T, string>> = (
	| FieldChange<T, K>
	| ArrayLengthChange<K>
)[];

/** Represents the aggregate change of an object. */
export type ChangeData<T> = {
	id: number;
	operation: 'add' | 'update';
	changes: FieldChanges<T>;
};

/** Finds all shared properties (keys) between `target` and `source` and returns an array of changes.
 *  Setting the `update` flag will also update the shared properties of `source` accordingly. */
export function diffAndUpdateSharedProps<T extends object>(
	target: T,
	source: Partial<T>,
	update: boolean = false,
	parentKey: string = ''
): FieldChanges<T> {
	const changes: FieldChanges<T> = [];

	const sharedKeys = Object.keys(target).filter(key => key in source);

	sharedKeys.forEach(key => {
		const fullKey = parentKey ? `${parentKey}.${key}` : key;
		const sourceVal = source[key as keyof T];
		const targetVal = target[key as keyof T];

		if (isStandardObj(sourceVal) && isStandardObj(targetVal)) {
			const subChanges = diffAndUpdateSharedProps(
				targetVal as Record<string, unknown>,
				sourceVal as Record<string, unknown>,
				update,
				fullKey
			);
			if (subChanges) {
				changes.push(...(subChanges as FieldChanges<T>));
			}
		} else if (Array.isArray(sourceVal) && Array.isArray(targetVal)) {
			if (sourceVal.length !== targetVal.length) {
				changes.push({
					key: fullKey as keyof T,
					oldValue: targetVal.length,
					newValue: sourceVal.length,
				} as ArrayLengthChange<Extract<keyof T, string>>);
			}
			if (update) {
				target[key as keyof T] = sourceVal.slice() as T[keyof T];
			}
		} else if (sourceVal !== targetVal) {
			changes.push({
				key: fullKey as Extract<keyof T, string>,
				oldValue: targetVal,
				newValue: sourceVal,
			} as FieldChange<T, Extract<keyof T, string>>);
			if (update) {
				target[key as keyof T] = sourceVal as T[keyof T];
			}
		}
	});

	return changes;
}
