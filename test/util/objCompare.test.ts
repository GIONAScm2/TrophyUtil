import {isStandardObj, sharedPropsAreEqual, diffAndUpdateSharedProps} from '../../src/util/index';
import {oldSeries, newSeries} from '../fixtures/seriesDocs';

describe('isStandardObj', () => {
	test(`should return false for anything that isn't a plain object or class instance`, () => {
		const items = ['{}', 1, null, undefined, [], new Date(), new Set(), new Map(), () => {}];
		expect(items.some(item => isStandardObj(item))).toBe(false);
	});

	test(`should return true for plain objects and class instances`, () => {
		const items = [
			{},
			new (class TestClass {
				prop = [];
			})(),
		];
		expect(items.every(item => isStandardObj(item))).toBe(true);
	});
});

describe('sharedPropsAreEqual', () => {
	test('should return null if no shared properties exist', () => {
		expect(sharedPropsAreEqual({a: 1}, {b: 2})).toBeNull();
	});

	test('should return true for objects with equal shared properties', () => {
		const obj1 = {a: 1, b: 'b', nest: {a: 1, b: [1, 2]}};
		const obj2 = {a: 1, c: 'c', nest: {a: 1, b: [3, '4']}};
		expect(sharedPropsAreEqual(obj1, obj2)).toBe(true);
	});

	test('should return false for objects with unequal shared properties', () => {
		const obj1 = {a: 1, nest: {a: 1, b: [1, 2]}};
		const obj2 = {a: 1, nest: {a: 2, b: [1, 2]}};
		expect(sharedPropsAreEqual(obj1, obj2)).toBe(false);
	});

	test('should return false for objects with shared array properties of different lengths', () => {
		const obj1 = {a: 1, nest: {a: 1, b: []}};
		const obj2 = {a: 1, nest: {a: 1, b: [null]}};
		expect(sharedPropsAreEqual(obj1, obj2)).toBe(false);
	});
});

describe('diffAndUpdateSharedProps', () => {
	test(`should accurately diff unequal shared properties`, () => {
		const objOld = {name: 'foo', b: 2, c: [1]};
		const objNew = {name: 'Foo', c: [1, 2]};
		const changes = diffAndUpdateSharedProps(objOld, objNew);
		expect(changes.length).toBe(2);
	});

	test(`should update an object and assert that it wasn't equal before, but is now`, () => {
		const equalityBefore = sharedPropsAreEqual(oldSeries, newSeries);
		diffAndUpdateSharedProps(oldSeries, newSeries, true);
		const equalityAfter = sharedPropsAreEqual(oldSeries, newSeries);
		expect(!equalityBefore && equalityAfter).toBe(true);
	});

	test(`should NOT register a 'change' when newValue is nullish`, () => {
		const dbItem = {numOwners: 0, title: 'CoD'};
		const domItem = {numOwners: undefined, title: ''};
		const fieldChanges = diffAndUpdateSharedProps(dbItem, domItem, true);
		console.log(fieldChanges);
		expect(fieldChanges.length).toBe(0);
	});
});
