import {PsnpGamePartial, PsnpGamePlayable} from '../../src/models/game.impl';
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
};

describe('PsnpGame', () => {
	it('should create a PsnpGame instance', () => {
		const game = new PsnpGamePartial(mockPsnpGame);
		expect(game).toBeInstanceOf(PsnpGamePartial);
	});

	it('should have the correct url property', () => {
		const game = new PsnpGamePartial(mockPsnpGame);
		expect(game.url).toBe('https://psnprofiles.com/trophies/1-test-game');
	});

	it('should have the correct src property', () => {
		const game = new PsnpGamePartial(mockPsnpGame);
		expect(game.src).toBe('https://i.psnprofiles.com/games/ABCD1234.png');
	});

	// Add more tests for other methods and properties
});

describe('PsnpGamePlayable', () => {
	it('should create a PsnpGamePlayable instance', () => {
		const game = new PsnpGamePlayable(mockPsnpGamePlayable);
		expect(game).toBeInstanceOf(PsnpGamePlayable);
	});

	it('should convert seconds to speed string', () => {
		const seconds = 0;
		const speedString = PsnpGamePlayable.secondsToSpeedString(seconds);
		expect(speedString).toBe('0 seconds');
	});
	it('should convert seconds to speed string', () => {
		const seconds = 1;
		const speedString = PsnpGamePlayable.secondsToSpeedString(seconds);
		expect(speedString).toBe('1 second');
	});
	it('should convert seconds to speed string', () => {
		const seconds = 3661;
		const speedString = PsnpGamePlayable.secondsToSpeedString(seconds);
		expect(speedString).toBe('1 hour, 1 minute');
	});

	it('should convert speed string to seconds', () => {
		const seconds = PsnpGamePlayable.speedStringToSeconds('0 seconds');
		expect(seconds).toBe(0);
	});
	it('should convert speed string to seconds', () => {
		const seconds = PsnpGamePlayable.speedStringToSeconds('1 second');
		expect(seconds).toBe(1);
	});
	it('should convert speed string to seconds', () => {
		const seconds = PsnpGamePlayable.speedStringToSeconds('1 hour, 1 minute');
		expect(seconds).toBe(3660);
	});

	// Add more tests for other methods and properties
});
