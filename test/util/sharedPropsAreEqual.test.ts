import {sharedPropsAreEqual} from '../../src/index';
import {oldSeries, newSeries} from '../fixtures/seriesDocs';

test('sharedPropsAreEqual should be true for oldSeries and newSeries', () => {
	expect(sharedPropsAreEqual(oldSeries, newSeries)).toBe(true);
});

test('sharedPropsAreEqual should be false for oldSeries and newSeries', () => {
	const newSeriesDifferent = {...newSeries, stages: [...newSeries.stages, ...newSeries.stages]};
	expect(sharedPropsAreEqual(oldSeries, newSeriesDifferent)).toBe(false);
});
