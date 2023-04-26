/** Returns true if `x` is a standard POJO (or class instance), otherwise false if it's a primitive/null/array/function/Map/Set. */
export declare function isStandardObj(x: unknown): x is Record<string, unknown>;
/** Checks whether all shared properties of `a` and `b` are equal. Useful to check whether an object is up-to-date.
 *
 * Object properties are recursed into. Array properties are compared solely on their length.
 *
 * If there are no shared properties, an error is thrown. */
export declare function sharedPropsAreEqual(obj1: Record<string, unknown>, obj2: Record<string, unknown>): boolean | null;
export type FieldChange<T, K extends keyof T> = {
    key: string;
    oldValue: T[K] | undefined;
    newValue: T[K] | undefined;
};
export type ArrayLengthChange<K extends string> = {
    key: K;
    oldValue: number;
    newValue: number;
};
export type FieldChanges<T, K extends Extract<keyof T, string> = Extract<keyof T, string>> = (FieldChange<T, K> | ArrayLengthChange<K>)[];
export type ChangeData<T> = {
    id: number;
    operation: 'add' | 'update';
    changes: FieldChanges<T>;
};
/** Finds all shared properties (keys) in `target` and `source` and updates `target` accordingly.
 * Array properties are updated by replacing the entire array if the lengths don't match.
 * Pass `trackChanges` to return a list of changes. */
export declare function updateSharedPropsWithChanges<T extends object>(target: T, source: Partial<T>, trackChanges?: boolean, parentKey?: string): FieldChanges<T> | undefined;
export declare function diffAndUpdateSharedProps<T extends object>(target: T, source: Partial<T>, update?: boolean, parentKey?: string): FieldChanges<T>;
//# sourceMappingURL=objCompare.d.ts.map