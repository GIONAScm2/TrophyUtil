import { describe, expect, it } from 'vitest';
import { PsnpGameBase, PsnpPlayableGame } from '../../src/models/game.impl';
import type { GameStackEntry, PlayableGame } from '../../src/models/game.interface';
import { msToSpeedString, speedStringToMs } from '../../src/util/psnp';

const mockPsnpGame: GameStackEntry = {
	id: 1,
	name: 'Test Game',
	slug: 'test-game',
	imagePath: 'ABCD1234',
	platforms: ['PS4'],
	stackLabel: null,
};

const mockPsnpPlayableGame: PlayableGame = {
	...mockPsnpGame,
	percent: 50,
	rarityBase: 10,
	completionSpeed: 3600,
	trophyCount: { bronze: 5, silver: 5, gold: 5, platinum: 1 },
	numTrophies: 16,
	points: 975,
};

describe('PsnpGame', () => {
	it('should create a PsnpGame instance', () => {
		const game = new PsnpGameBase(mockPsnpGame);
		expect(game).toBeInstanceOf(PsnpGameBase);
	});

	it('should have the correct url property', () => {
		const game = new PsnpGameBase(mockPsnpGame);
		expect(game.url).toBe('https://psnprofiles.com/trophies/1-test-game');
	});

	it('should have the correct src property', () => {
		const game = new PsnpGameBase(mockPsnpGame);
		expect(game.src).toBe('https://i.psnprofiles.com/games/ABCD1234.png');
	});
});

describe('PsnpPlayableGame', () => {
	it('should create a PsnpPlayableGame instance', () => {
		const game = new PsnpPlayableGame(mockPsnpPlayableGame);
		expect(game).toBeInstanceOf(PsnpPlayableGame);
	});

	it('should convert ms to speed string', () => {
		const seconds = 0;
		const speedString = msToSpeedString(seconds);
		expect(speedString).toBe('0 seconds');
	});
	it('should convert ms to speed string', () => {
		const seconds = 1000;
		const speedString = msToSpeedString(seconds);
		expect(speedString).toBe('1 second');
	});
	it('should convert ms to speed string', () => {
		const seconds = 3661000;
		const speedString = msToSpeedString(seconds);
		expect(speedString).toBe('1 hour, 1 minute');
	});

	it('should convert speed string to seconds', () => {
		const seconds = speedStringToMs('0 seconds');
		expect(seconds).toBe(0);
	});
	it('should convert speed string to seconds', () => {
		const seconds = speedStringToMs('1 second');
		expect(seconds).toBe(1000);
	});
	it('should convert speed string to seconds', () => {
		const seconds = speedStringToMs('1 hour, 1 minute');
		expect(seconds).toBe(3660000);
	});
});
