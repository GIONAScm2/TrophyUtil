import { type IPsnpEntity } from '../models/psnpEntity.js';
/** Returns `true` if `x` is a standard POJO (or class instance), otherwise `false` if it's a primitive/null/array/function/Map/Set/etc. */
export declare function isStandardObj(x: unknown): x is Record<string, unknown>;
/** Compares shared properties of `obj1` and `obj2` for relative equality. Primitive values - including nested object properties -
 * must be equal, and array values must have the same length. Returns `null` if no shared properties exist.
 *
 * Useful for verifying if MongoDB documents are up-to-date with freshly-parsed entities. */
export declare function sharedPropsAreEqual(obj1: Record<string, unknown>, obj2: Record<string, unknown>): boolean | null;
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
export type FieldChanges<T, K extends Extract<keyof T, string> = Extract<keyof T, string>> = (FieldChange<T, K> | ArrayLengthChange<K>)[];
/** Represents the aggregate change of an object. */
export type ChangeData<T> = {
    id: number;
    operation: 'add' | 'update';
    changes: FieldChanges<T>;
};
/** Finds all shared properties (keys) between `target` and `source` and returns an array of changes.
 *  Setting the `update` flag will also update the shared properties of `source` accordingly. */
export declare function diffAndUpdateSharedProps<T extends object>(target: T, source: Partial<T>, update?: boolean, parentKey?: string): FieldChanges<T>;
/**
 * Compares `oldEntity` to `newEntity` and returns a log of changes based on their shared properties.
 * The `update` flag will also update `oldEntity` with any differing shared property values.
 *
 * **Note:** "new" operations return an empty `changes` array. */
export declare function diffUpdate<E extends IPsnpEntity>(oldEntity: E | null | undefined, newEntity: E, update: boolean): ChangeData<E>;
//# sourceMappingURL=objCompare.d.ts.map