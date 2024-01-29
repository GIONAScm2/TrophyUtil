import {dirname, resolve} from 'path';
import {fileURLToPath} from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
import fs from 'fs';
import {
	ParserGameStandard,
	ParserGamePlayable,
	ParserGamePartialStack,
	ParserGamePage,
	ParserDlcListing,
} from '../../src/parsers/index';
import {Select, isGameStandard, isGameFromStacks, isGamePlayable, isGameDlc, msToSpeedString} from '../../src/util/index';
import {JSDOM} from 'jsdom';
import {IGameStandard, IGamePartialTrophyList, IGamePlayable, IGameDlc} from '../../src/models/game.interface';
import { PsnpTrophy } from '../../src';

beforeAll(() => {
	const html = fs.readFileSync(resolve(__dirname, '../fixtures/psnpGameVariety.html'), 'utf8');
	document.body.innerHTML = html;
});

describe('Parsing from GAMES pages', () => {
	let games: IGameStandard[];

	beforeEach(() => {
		const parser = new ParserGameStandard();
		const nodes = [...document.querySelectorAll<HTMLTableRowElement>('[data-page="game_home"] tr')];
		games = nodes.map(node => parser.parse(node));
	});

	test('should ensure games have all expected properties', () => {
		expect(games.every(game => isGameStandard(game))).toBe(true);
	});
	test('should accurately parse properties for games WITH plats', () => {
		expect(games[0]).toMatchObject({
			_id: 21982,
			_nameSerialized: 'tin-can',
			name: 'Tin Can',
			_imagePath: 'a2d2ab/Sb08232',
			stackLabel: null,
			platforms: ['PS5'],
			trophyCount: {bronze: 4, silver: 5, gold: 9, platinum: 1},
			numOwners: 0,
			numTrophies: 19,
			points: 1320,
		});
	});
	test('should accurately parse properties for games WITHOUT plats', () => {
		expect(games[1]).toMatchObject({trophyCount: {bronze: 9, silver: 2, gold: 1, platinum: 0}});
	});
});

describe('Parsing from GAMES SEARCH pages', () => {
	let games: IGameStandard[];

	beforeEach(() => {
		const parser = new ParserGameStandard();
		const nodes = [...document.querySelectorAll<HTMLTableRowElement>('[data-page="game_search"] tr')];
		games = nodes.map(node => parser.parse(node));
	});

	test('should ensure games have all expected properties', () => {
		expect(games.every(game => isGameStandard(game))).toBe(true);
	});
	test('should accurately parse properties for games WITH plats', () => {
		expect(games[0]).toMatchObject({
			_id: 1719,
			_nameSerialized: 'call-of-duty-black-ops-ii',
			name: 'Call of Duty: Black Ops II',
			_imagePath: 'e82749/S5b68e9',
			stackLabel: null,
			platforms: ['PS3'],
			trophyCount: {bronze: 77, silver: 11, gold: 2, platinum: 1},
			numOwners: 1224886,
			numTrophies: 91,
			points: 1965,
		});
	});
	test('should accurately parse properties for games WITHOUT plats', () => {
		expect(games[1]).toMatchObject({
			_id: 1961,
			_nameSerialized: 'call-of-juarez-gunslinger',
			name: 'Call of Juarez: Gunslinger',
			_imagePath: 'a6f110/S656417',
			stackLabel: null,
			platforms: ['PS3'],
			trophyCount: {bronze: 13, silver: 4, gold: 0, platinum: 0},
			numOwners: 68811,
			numTrophies: 17,
			points: 315,
		});
	});
});

describe('Parsing from STACK PANEL', () => {
	let games: IGamePartialTrophyList[];

	beforeEach(() => {
		const parser = new ParserGamePartialStack();
		const nodes = [...document.querySelectorAll<HTMLTableRowElement>('[data-page="trophy_list"] tr')];
		games = nodes.map(node => parser.parse(node));
	});

	test('should ensure games have all expected properties', () => {
		expect(games.every(game => isGameFromStacks(game))).toBe(true);
	});
	test('should accurately parse properties', () => {
		expect(games).toMatchObject([
			{
				_id: 9930,
				_nameSerialized: 'star-wars-jedi-fallen-order',
				name: 'Star Wars Jedi: Fallen Order',
				_imagePath: '673a4c/Sc4da58',
				stackLabel: 'EU',
				platforms: ['PS4'],
			},
			{
				_id: 13143,
				_nameSerialized: 'star-wars-jedi-fallen-order',
				name: 'Star Wars Jedi: Fallen Order',
				_imagePath: '85aa0d/Sb486c3',
				stackLabel: null,
				platforms: ['PS5'],
			},
		]);
	});
});

describe('Parsing from PROFILE pages', () => {
	let games: IGamePlayable[];

	beforeEach(() => {
		const parser = new ParserGamePlayable();
		const nodes = [...document.querySelectorAll<HTMLTableRowElement>(`[data-page="profile"] ${Select.TR}`)];
		games = nodes.map(node => parser.parse(node));
	});

	test('should ensure games have all expected properties', () => {
		expect(games.every(game => isGamePlayable(game))).toBe(true);
	});
	test('should accurately parse properties', () => {
		const hasPlatNoDlcNoneEarned = games[0];
		const hasPlatNoDlcSomeEarned = games[1];
		const hasPlatNoDlcAllEarned = games[2];

		const hasPlatAndDlcNoneEarned = games[3];
		const hasPlatAndDlcSomeEarned = games[4];
		const hasPlatAndDlcPlatEarned = games[5];
		const hasPlatAndDlcAllEarned = games[6];

		const noPlatNoneEarned = games[7];
		const noPlatSomeEarned = games[8];
		const noPlatAllEarned = games[9];

		expect(hasPlatNoDlcNoneEarned).toEqual({
			_id: 22025,
			_nameSerialized: 'trackmania',
			name: 'Trackmania',
			_imagePath: '2e454c/S90418d',
			stackLabel: null,
			trophyCount: {bronze: 0, silver: 0, gold: 0, platinum: 0},
			numTrophies: 0,
			points: 0,
			platforms: ['PS5'],
			rarityBase: 0.45,
			rarityDlc: undefined,
			percent: 0,
			completionStatus: undefined,
			completionSpeed: undefined,
			completionRank: 'F',
			latestTrophy: undefined,
		});
		expect(hasPlatNoDlcSomeEarned).toEqual({
			_id: 14617,
			_nameSerialized: 'battlefield-2042',
			name: 'Battlefield 2042',
			_imagePath: 'd9f335/Sc06abf',
			stackLabel: 'NA',
			trophyCount: {bronze: 7, silver: 4, gold: 2, platinum: 0},
			numTrophies: 13,
			points: 405,
			platforms: ['PS4'],
			rarityBase: 3.78,
			rarityDlc: undefined,
			percent: 42,
			completionStatus: undefined,
			completionSpeed: undefined,
			completionRank: 'A',
			latestTrophy: 1684814400000,
		});
		expect(hasPlatNoDlcAllEarned).toEqual({
			_id: 1856,
			_nameSerialized: 'tomb-raider',
			name: 'Tomb Raider',
			_imagePath: 'e74fa4/S43dc8e',
			stackLabel: null,
			trophyCount: {bronze: 41, silver: 7, gold: 2, platinum: 1},
			numTrophies: 51,
			points: 1305,
			platforms: ['PS3'],
			rarityBase: 4.85,
			rarityDlc: undefined,
			percent: 100,
			completionStatus: 'platinum',
			completionSpeed: 149783040000,
			completionRank: 'S',
			latestTrophy: 1682136000000,
		});
		expect(msToSpeedString(hasPlatNoDlcAllEarned.completionSpeed!)).toBe('4 years, 9 months');

		expect(hasPlatAndDlcNoneEarned).toEqual({
			_id: 2783,
			_nameSerialized: 'velocity-2x',
			name: 'Velocity 2X',
			_imagePath: '96db96/Sc1e63c',
			stackLabel: null,
			trophyCount: {bronze: 0, silver: 0, gold: 0, platinum: 0},
			numTrophies: 0,
			points: 0,
			platforms: ['PS4', 'Vita'],
			rarityBase: 1.4,
			rarityDlc: 0.33,
			percent: 0,
			completionStatus: undefined,
			completionSpeed: undefined,
			completionRank: 'F',
			latestTrophy: undefined,
		});
		expect(hasPlatAndDlcSomeEarned).toEqual({
			_id: 462,
			_nameSerialized: 'dead-nation',
			name: 'Dead Nation',
			_imagePath: 'b62eda/S06ebd3',
			stackLabel: null,
			trophyCount: {bronze: 3, silver: 0, gold: 0, platinum: 0},
			numTrophies: 3,
			points: 45,
			platforms: ['PS3'],
			rarityBase: 5.46,
			rarityDlc: 1.22,
			percent: 3,
			completionStatus: undefined,
			completionSpeed: undefined,
			completionRank: 'E',
			latestTrophy: 1307592000000,
		});
		expect(hasPlatAndDlcPlatEarned).toEqual({
			_id: 3379,
			_nameSerialized: 'helldivers',
			name: 'Helldivers',
			_imagePath: 'ee82d8/S3c029d',
			stackLabel: null,
			trophyCount: {bronze: 14, silver: 18, gold: 5, platinum: 1},
			numTrophies: 38,
			points: 1500,
			platforms: ['PS3', 'PS4', 'Vita'],
			rarityBase: 1.78,
			rarityDlc: 1.26,
			percent: 96,
			completionStatus: 'platinum',
			completionSpeed: 97234560000,
			completionRank: 'A',
			latestTrophy: 1612760400000,
		});
		expect(msToSpeedString(hasPlatAndDlcPlatEarned.completionSpeed!)).toBe('3 years, 1 month');
		expect(hasPlatAndDlcAllEarned).toEqual({
			_id: 2251,
			_nameSerialized: 'sound-shapes',
			name: 'Sound Shapes',
			_imagePath: 'c885c0/Scba921',
			stackLabel: 'NA',
			trophyCount: {bronze: 0, silver: 87, gold: 1, platinum: 1},
			numTrophies: 89,
			points: 3000,
			platforms: ['PS4'],
			rarityBase: 33.76,
			rarityDlc: 20.28,
			percent: 100,
			completionStatus: 'platinum',
			completionSpeed: 31311360000,
			completionRank: 'S',
			latestTrophy: 1470196800000,
		});
		expect(msToSpeedString(hasPlatAndDlcAllEarned.completionSpeed!)).toBe('11 months, 4 weeks');

		expect(noPlatNoneEarned).toEqual({
			_id: 4046,
			_nameSerialized: 'gems-of-war',
			name: 'Gems of War',
			_imagePath: '33a7c0/S1c320e',
			stackLabel: null,
			trophyCount: {bronze: 0, silver: 0, gold: 0, platinum: 0},
			numTrophies: 0,
			points: 0,
			platforms: ['PS4'],
			rarityBase: 0,
			rarityDlc: undefined,
			percent: 0,
			completionStatus: undefined,
			completionSpeed: undefined,
			completionRank: 'F',
			latestTrophy: undefined,
		});
		expect(noPlatSomeEarned).toEqual({
			_id: 9668,
			_nameSerialized: 'dead-by-daylight-additional-chapters',
			name: 'Dead by Daylight • Additional Chapters',
			_imagePath: '4e6996/S3f3b32',
			stackLabel: null,
			trophyCount: {bronze: 0, silver: 5, gold: 0, platinum: 0},
			numTrophies: 5,
			points: 150,
			platforms: ['PS4'],
			rarityBase: 0.14,
			rarityDlc: undefined,
			percent: 8,
			completionStatus: undefined,
			completionSpeed: undefined,
			completionRank: 'B',
			latestTrophy: 1656129600000,
		});
		expect(noPlatAllEarned).toEqual({
			_id: 2252,
			_nameSerialized: 'flower',
			name: 'Flower',
			_imagePath: 'fb5f19/Sd87cf2',
			stackLabel: null,
			trophyCount: {bronze: 11, silver: 2, gold: 1, platinum: 0},
			numTrophies: 14,
			points: 315,
			platforms: ['PS4'],
			rarityBase: 8.82,
			rarityDlc: undefined,
			percent: 100,
			completionStatus: 'completed',
			completionSpeed: 62280000,
			completionRank: 'S',
			latestTrophy: 1386133200000,
		});
		expect(msToSpeedString(noPlatAllEarned.completionSpeed!)).toBe('17 hours, 18 minutes');
	});
});

describe('Parsing from SERIES pages', () => {
	let games: IGamePlayable[];

	beforeEach(() => {
		const parser = new ParserGamePlayable();
		const nodes = [...document.querySelectorAll<HTMLTableRowElement>(`[data-page="series"] ${Select.TR}`)];
		games = nodes.map(node => parser.parse(node));
	});

	test('should ensure games have all expected properties', () => {
		expect(games.every(game => isGamePlayable(game))).toBe(true);
	});

	test('should accurately parse properties', () => {
		expect(games).toEqual([
			{
				_id: 1945,
				_nameSerialized: 'far-cry-3-blood-dragon',
				name: 'Far Cry 3 Blood Dragon',
				_imagePath: '3c8202/Sb9b47e',
				stackLabel: null,
				trophyCount: {bronze: 2, silver: 0, gold: 0, platinum: 0},
				numTrophies: 2,
				points: 30,
				platforms: ['PS3'],
				rarityBase: 22.69,
				rarityDlc: undefined,
				percent: 10,
				completionStatus: undefined,
				completionSpeed: undefined,
				completionRank: undefined,
				latestTrophy: 1407643200000,
			},
			{
				_id: 4365,
				_nameSerialized: 'far-cry-primal',
				name: 'Far Cry Primal',
				_imagePath: '224e3f/S9a9e72',
				stackLabel: null,
				trophyCount: {bronze: 38, silver: 10, gold: 2, platinum: 1},
				numTrophies: 51,
				points: 1350,
				platforms: ['PS4'],
				rarityBase: 26.32,
				rarityDlc: undefined,
				percent: 100,
				completionStatus: 'platinum',
				completionSpeed: 208800000,
				completionRank: undefined,
				latestTrophy: 1470628800000,
			},
			{
				_id: 8740,
				_nameSerialized: 'far-cry-new-dawn',
				name: 'Far Cry: New Dawn',
				_imagePath: '33350a/Sf26d5b',
				stackLabel: null,
				trophyCount: {bronze: 38, silver: 10, gold: 2, platinum: 1},
				numTrophies: 51,
				points: 1350,
				platforms: ['PS4'],
				rarityBase: 27.37,
				rarityDlc: undefined,
				percent: 100,
				completionStatus: 'platinum',
				completionSpeed: 111600000,
				completionRank: undefined,
				latestTrophy: 1550552400000,
			},
			{
				_id: 14951,
				_nameSerialized: 'far-cry-3-blood-dragon-classic-edition',
				name: 'Far Cry 3 Blood Dragon Classic Edition',
				_imagePath: '57bbfd/S3d459c',
				stackLabel: null,
				trophyCount: {bronze: 18, silver: 1, gold: 0, platinum: 0},
				numTrophies: 19,
				points: 300,
				platforms: ['PS4'],
				rarityBase: 22.75,
				rarityDlc: undefined,
				percent: undefined,
				completionStatus: undefined,
				completionSpeed: undefined,
				completionRank: undefined,
				latestTrophy: undefined,
			},
			{
				_id: 2429,
				_nameSerialized: 'far-cry-classic',
				name: 'Far Cry Classic',
				_imagePath: 'ed2a17/Sab551f',
				stackLabel: null,
				trophyCount: {bronze: 5, silver: 9, gold: 7, platinum: 1},
				numTrophies: 22,
				points: 1275,
				platforms: ['PS3'],
				rarityBase: 30.69,
				rarityDlc: undefined,
				percent: 100,
				completionStatus: 'platinum',
				completionSpeed: 108000000,
				completionRank: undefined,
				latestTrophy: 1434945600000,
			},
		]);
	});
});

describe('Parsing from DLC page', () => {
	let games: IGameDlc[];

	beforeEach(() => {
		const parser = new ParserDlcListing();
		const nodes = [...document.querySelectorAll<HTMLTableRowElement>('[data-page="dlc"] tr')];
		games = nodes.map(node => parser.parse(node));
	});

	test('should ensure games have all expected properties', () => {
		expect(games.every(game => isGameDlc(game))).toBe(true);
	});
	test('should accurately parse properties', () => {
		expect(games).toEqual([
			{
				_id: 22414,
				_nameSerialized: 'street-fighter-6',
				name: 'Street Fighter 6',
				_imagePath: 'f6b6f6/S72a7df',
				dlcName: 'FIGHTING GROUND',
				groupNum: 2,
				platforms: ['PS5'],
				trophyCount: {bronze: 3, silver: 2, gold: 1, platinum: 0},
				numTrophies: 6,
				points: 195,
			},
			{
				_id: 16519,
				_nameSerialized: 'kao-the-kangaroo',
				name: 'Kao the Kangaroo',
				_imagePath: '693320/S82409b',
				dlcName: 'Bend the Rooles',
				groupNum: 1,
				platforms: ['PS4'],
				trophyCount: {bronze: 9, silver: 2, gold: 0, platinum: 0},
				numTrophies: 11,
				points: 195,
			},
		]);
	});
});

describe('Parsing from TROPHY LIST page details', () => {
	test(`should accurately parse properties from trophy list`, () => {
		const html = fs.readFileSync(resolve(__dirname, '../fixtures/psnpTrophyListTEW.html'), 'utf8');
		const jsdom = new JSDOM(html);

		const parser = new ParserGamePage();
		const game = parser.parse(jsdom.window.document);
		const trophies = game.trophyGroups.flatMap(group => group.trophies.map(trophy => new PsnpTrophy(trophy)));
		const sampleTrophyElement = trophies[0].getElement(jsdom.window.document)

		expect(sampleTrophyElement).not.toBeNull();

		expect(game._id).toBe(2983);
		expect(game.name).toBe('The Evil Within');
		expect(game._nameSerialized).toBe('the-evil-within');
		expect(game.forumId).toBe(2725);
		expect(game.platforms.length).toBe(1);
		expect(game.stackLabel).toBeNull();
		expect(game.stacks.length).toBe(6);
		expect(game.trophyGroups.length).toBe(4);

		expect(game.headerStats).toEqual({
			gameOwners: 249094,
			recentPlayers: 94,
			numPlatted: 9903,
			avgCompletion: 12,
			trophiesEarned: 2727859,
			num100Percented: 3767,
		});

		expect(game.rarityBase).toBe(3.98);
		expect(game.rarityDlc).toBe(1.51);

		expect(game.metaData).toEqual({
			developer: 'Tango Gameworks',
			publisher: 'Bethesda Softworks',
			genres: ['Shooter', 'Adventure'],
			themes: ['Action', 'Horror', 'Survival'],
			modes: ['Single player'],
			otherNames: [
				'サイコブレイク',
				'Psychobreak',
				'Project Zwei',
				'PsychoBreak',
				'Mobius',
				'PsychoBreak',
				'Project Zwei',
				'サイコブレイク',
				'Mobius',
			],
		});
	});

	test(`should accurately parse properties from NEW trophy list`, () => {
		const html = fs.readFileSync(resolve(__dirname, '../fixtures/psnpTrophyListNew.html'), 'utf8');
		const jsdom = new JSDOM(html);

		const parser = new ParserGamePage();
		const game = parser.parse(jsdom.window.document);

		expect(game.headerStats).toEqual({
			gameOwners: 0,
			recentPlayers: 0,
			numPlatted: 0,
			avgCompletion: 0,
			trophiesEarned: 0,
			num100Percented: 0,
		});

		expect(game.rarityBase).toBe(0);
		expect(game.rarityDlc).toBeUndefined();
	});

	test(`should accurately parse properties from NONPLAT trophy list`, () => {
		const html = fs.readFileSync(resolve(__dirname, '../fixtures/psnpTrophyListNonplat.html'), 'utf8');
		const jsdom = new JSDOM(html);

		const parser = new ParserGamePage();
		const game = parser.parse(jsdom.window.document);

		expect(game.rarityBase).toBe(1.62);
		expect(game.rarityDlc).toBeUndefined();
	});
});
