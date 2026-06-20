import { describe, expect, it } from 'vitest';
import { labelStacks } from '../../src/models/stackData';
import type { GameStack } from '../../src/models/game.interface';

describe('StackData.labelStacks', () => {
	it('should change null->WW only in some cases', () => {
		const stacks1: GameStack[] = [
			{ stackLabel: null, platforms: ['PS4'] },
			{ stackLabel: null, platforms: ['PS5'] },
			{ stackLabel: 'AS', platforms: ['PS5'] },
			{ stackLabel: null, platforms: ['PS4', 'VR'] },
		];
		const stacks = labelStacks(stacks1).map(stack => stack.stack);
		expect(stacks).toEqual([`PS4`, `PS5_WW`, `PS5_AS`, `PSVR`]);
	});

	it('should display platform+region for each P4D stack', () => {
		const stacksP4D: GameStack[] = [
			{ stackLabel: 'JP', platforms: ['Vita'] },
			{ stackLabel: 'NA', platforms: ['Vita'] },
			{ stackLabel: 'EU', platforms: ['Vita'] },
			{ stackLabel: 'AS', platforms: ['Vita'] },
			{ stackLabel: 'JP', platforms: ['PS4'] },
			{ stackLabel: 'AS', platforms: ['PS4'] },
			{ stackLabel: null, platforms: ['PS4'] },
		];
		const stacks = labelStacks(stacksP4D).map(stack => stack.stack);
		expect(stacks).toEqual([`Vita_JP`, `Vita_NA`, `Vita_EU`, `Vita_AS`, `PS4_JP`, `PS4_AS`, `PS4_WW`]);
	});

	it('should correctly label Persona 5 stacks', () => {
		const stacksP5: GameStack[] = [
			{ stackLabel: 'JP', platforms: ['PS3', 'PS4'] },
			{ stackLabel: 'HK', platforms: ['PS4'] },
			{ stackLabel: null, platforms: ['PS3', 'PS4'] },
			{ stackLabel: 'KR', platforms: ['PS4'] },
		];
		const stacks = labelStacks(stacksP5).map(stack => stack.stack);
		expect(stacks).toEqual([`JP`, `HK`, `WW`, `KR`]);
	});
});
