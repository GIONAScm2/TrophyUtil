import {PsnpGameBase, PsnpGamePlayable} from '../../src/models/game.impl';
import {IGamePartialTrophyList, IGamePlayable} from '../../src/models/game.interface';

const mockPsnpGame: IGamePartialTrophyList = {
	_id: 1,
	name: 'Test Game',
	_nameSerialized: 'test-game',
	_imagePath: 'ABCD1234',
	platforms: ['PS4'],
	stackLabel: null,
};

const mockPsnpGamePlayable: IGamePlayable = {
	...mockPsnpGame,
	percent: 50,
	rarityBase: 10,
	completionSpeed: 3600,
	trophyCount: {bronze: 5, silver: 5, gold: 5, platinum: 1},
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

describe('PsnpGamePlayable', () => {
	it('should create a PsnpGamePlayable instance', () => {
		const game = new PsnpGamePlayable(mockPsnpGamePlayable);
		expect(game).toBeInstanceOf(PsnpGamePlayable);
	});

	it('should convert ms to speed string', () => {
		const seconds = 0;
		const speedString = PsnpGamePlayable.msToSpeedString(seconds);
		expect(speedString).toBe('0 seconds');
	});
	it('should convert ms to speed string', () => {
		const seconds = 1000;
		const speedString = PsnpGamePlayable.msToSpeedString(seconds);
		expect(speedString).toBe('1 second');
	});
	it('should convert ms to speed string', () => {
		const seconds = 3661000;
		const speedString = PsnpGamePlayable.msToSpeedString(seconds);
		expect(speedString).toBe('1 hour, 1 minute');
	});

	it('should convert speed string to seconds', () => {
		const seconds = PsnpGamePlayable.speedStringToMs('0 seconds');
		expect(seconds).toBe(0);
	});
	it('should convert speed string to seconds', () => {
		const seconds = PsnpGamePlayable.speedStringToMs('1 second');
		expect(seconds).toBe(1000);
	});
	it('should convert speed string to seconds', () => {
		const seconds = PsnpGamePlayable.speedStringToMs('1 hour, 1 minute');
		expect(seconds).toBe(3660000);
	});
});
