import {StackData} from '../../src/models/stackData';
import {IGameStack} from '../../src/models/game.interface';

describe('StackData.labelStacks', () => {
	it('should change null->WW only in some cases', () => {
		const stacks1: IGameStack[] = [
			{stackLabel: null, platforms: ['PS4']},
			{stackLabel: null, platforms: ['PS5']},
			{stackLabel: 'AS', platforms: ['PS5']},
			{stackLabel: null, platforms: ['PS4', 'VR']},
		];
		const stacks = new StackData(stacks1).stacks.map(stack => stack.stack);
		expect(stacks).toEqual([`PS4`, `PS5_WW`, `PS5_AS`, `PSVR`]);
	});

	it('should display platform+region for each P4D stack', () => {
		const stacksP4D: IGameStack[] = [
			{stackLabel: 'JP', platforms: ['Vita']},
			{stackLabel: 'NA', platforms: ['Vita']},
			{stackLabel: 'EU', platforms: ['Vita']},
			{stackLabel: 'AS', platforms: ['Vita']},
			{stackLabel: 'JP', platforms: ['PS4']},
			{stackLabel: 'AS', platforms: ['PS4']},
			{stackLabel: null, platforms: ['PS4']},
		];
		const stacks = new StackData(stacksP4D).stacks.map(stack => stack.stack);
		expect(stacks).toEqual([`Vita_JP`, `Vita_NA`, `Vita_EU`, `Vita_AS`, `PS4_JP`, `PS4_AS`, `PS4_WW`]);
	});

	it('should correctly label Persona 5 stacks', () => {
		const stacksP5: IGameStack[] = [
			{stackLabel: 'JP', platforms: ['PS3', 'PS4']},
			{stackLabel: 'HK', platforms: ['PS4']},
			{stackLabel: null, platforms: ['PS3', 'PS4']},
			{stackLabel: 'KR', platforms: ['PS4']},
		];
		const stacks = new StackData(stacksP5).stacks.map(stack => stack.stack);
		expect(stacks).toEqual([`JP`, `HK`, `WW`, `KR`]);
	});
});
