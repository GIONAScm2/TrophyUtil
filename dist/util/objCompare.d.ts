import { type IPsnpEntity } from '../models/psnpEntity.js';
/** Returns `true` if `x` is a standard POJO (or class instance), otherwise `false` if it's a primitive/null/array/function/Map/Set/etc. */
export declare function isStandardObj(x: unknown): x is Record<string, unknown>;
/** Compares shared properties of `obj1` and `obj2` for relative equality. Primitive values - including nested object properties -
 * must be equal, and array values must have the same length. Returns `null` if no shared properties exist.
 *
 * Useful for verifying if MongoDB documents are up-to-date with freshly-parsed entities. */
export declare function sharedPropsAreEqual(obj1: Record<string, unknown>, obj2: Record<string, unknown>): boolean | null;
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
export declare function diffAndUpdateSharedProps<T extends object>(oldEntity: Partial<T>, newEntity: Partial<T>, update?: boolean, parentKey?: string): FieldChanges;
/**
 * Compares `oldEntity` to `newEntity` and returns a log of changes based on their shared properties.
 * The `update` flag will also update `oldEntity` with any differing shared property values.
 *
 * **Note:** "new" operations return an empty `changes` array. */
export declare function diffUpdate<E extends IPsnpEntity>(oldEntity: E | null | undefined, newEntity: E, update: boolean): ChangeData;
/**
 * Removes extraneous properties from `target` that don't exist on `exemplar`.
 * This includes properties nested within objects.
 * Outputs log for every omitted property.
 *
 * @param {Record<string, unknown>} exemplar - The object that holds the desired structure.
 * @param {unknown} target - The object from which extraneous properties are to be pruned.
 * @returns {Record<string, unknown> | null} - The pruned object, or null if the target wasn't an object.
 */
export declare function pruneExtraneousProperties(exemplar: Record<string, unknown>, target: unknown): Record<string, unknown> | null;
//# sourceMappingURL=objCompare.d.ts.map