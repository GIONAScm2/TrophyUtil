import type { GameStack, PlatformTag } from './game.interface.js';

export interface LabeledGameStack extends GameStack {
	stack: string;
	platformString: string;
	stackLabels: string[];
}

type StackGroups = Record<string, LabeledGameStack[]>;

/** Returns PSNProfiles platform tags normalized for stack display. */
export function buildPlatformTag(platforms: readonly PlatformTag[]): string {
	if (platforms.includes('VR')) {
		if (platforms.includes('PS4')) return 'PSVR';
		if (platforms.includes('PS5')) return 'PSVR2';
	}

	return [...platforms].join('/');
}

/** Labels a group of stack-related games using the smallest stable platform/region label. */
export function labelStacks(stacks: readonly GameStack[]): LabeledGameStack[] {
	const detailedStacks = stacks.map(stack => ({
		...stack,
		platformString: buildPlatformTag(stack.platforms),
		stack: '',
		stackLabels: [] as string[],
	}));
	const separator = '_';

	if (detailedStacks.length <= 1) {
		return detailedStacks.map(stack => {
			stack.stackLabels.push(stack.stackLabel ?? stack.platformString);
			return { ...stack, stack: stack.stackLabels.join(separator) };
		});
	}

	const gamesByStackLabel = groupByStackLabel(detailedStacks);
	const numStackLabels = Object.keys(gamesByStackLabel).length;

	if (numStackLabels === detailedStacks.length) {
		for (const stack of detailedStacks) {
			let label = stack.stackLabel ?? '';
			if (!label && !gamesByStackLabel.NA) {
				label = gamesByStackLabel.EU ? 'NA' : 'WW';
			}
			stack.stackLabels.push(label || 'WW');
		}
		return detailedStacks.map(stack => ({ ...stack, stack: stack.stackLabels.join(separator) }));
	}

	const gamesByPlatform = groupByPlatform(detailedStacks);
	const numPlatforms = Object.keys(gamesByPlatform).length;

	for (const [platform, games] of Object.entries(gamesByPlatform)) {
		if (games.length === 1) {
			const game = games.at(0);
			if (!game) continue;
			game.stackLabels.push(game.platformString);
			if (game.stackLabel) game.stackLabels.push(game.stackLabel);
			continue;
		}

		const someStackAbbrs = games.some(game => game.stackLabel);
		if (!someStackAbbrs) {
			games.forEach(game => game.stackLabels.push(platform));
			continue;
		}

		for (const game of games) {
			if (numPlatforms > 1) game.stackLabels.push(game.platformString);
			game.stackLabels.push(game.stackLabel ?? 'WW');
		}
	}

	return detailedStacks.map(stack => ({ ...stack, stack: stack.stackLabels.join(separator) }));
}

function groupByStackLabel(stacks: LabeledGameStack[]): StackGroups {
	return groupBy(stacks, stack => stack.stackLabel ?? '');
}

function groupByPlatform(stacks: LabeledGameStack[]): StackGroups {
	return groupBy(stacks, stack => stack.platformString);
}

function groupBy(stacks: LabeledGameStack[], getKey: (stack: LabeledGameStack) => string): StackGroups {
	const groups: StackGroups = {};

	for (const stack of stacks) {
		const key = getKey(stack);
		groups[key] ??= [];
		groups[key].push(stack);
	}

	return groups;
}
