import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
import fs from 'fs';
import {
	GameListingParser,
	PlayableGameParser,
	GameStackEntryParser,
	GamePageParser,
	DlcListingParser,
} from '../../src/parsers/index';
import {
	Select,
	isGameListing,
	isGameStackEntry,
	isPlayableGame,
	isGameDlc,
	msToSpeedString,
} from '../../src/util/index';
import { JSDOM } from 'jsdom';
import type { GameListing, GameStackEntry, PlayableGame, GameDlc } from '../../src/models/game.interface';
import { PsnpTrophy } from '../../src';

beforeAll(() => {
	const html = fs.readFileSync(resolve(__dirname, '../fixtures/psnpGameVariety.html'), 'utf8');
	document.body.innerHTML = html;
});

describe('Parsing from GAMES pages', () => {
	let games: GameListing[];

	beforeEach(() => {
		const parser = new GameListingParser();
		const nodes = [...document.querySelectorAll<HTMLTableRowElement>('[data-page="game_home"] tr')];
		games = nodes.map(node => parser.parse(node));
	});

	test('should ensure games have all expected properties', () => {
		expect(games.every(game => isGameListing(game))).toBe(true);
	});
	test('should accurately parse properties for games WITH plats', () => {
		expect(games[0]).toMatchObject({
			id: 21982,
			slug: 'tin-can',
			name: 'Tin Can',
			imagePath: 'a2d2ab/Sb08232',
			stackLabel: null,
			platforms: ['PS5'],
			trophyCount: { bronze: 4, silver: 5, gold: 9, platinum: 1 },
			numOwners: 0,
			numTrophies: 19,
			points: 1320,
		});
	});
	test('should accurately parse properties for games WITHOUT plats', () => {
		expect(games[1]).toMatchObject({ trophyCount: { bronze: 9, silver: 2, gold: 1, platinum: 0 } });
	});
});

describe('Parsing from GAMES SEARCH pages', () => {
	let games: GameListing[];

	beforeEach(() => {
		const parser = new GameListingParser();
		const nodes = [...document.querySelectorAll<HTMLTableRowElement>('[data-page="game_search"] tr')];
		games = nodes.map(node => parser.parse(node));
	});

	test('should ensure games have all expected properties', () => {
		expect(games.every(game => isGameListing(game))).toBe(true);
	});
	test('should accurately parse properties for games WITH plats', () => {
		expect(games[0]).toMatchObject({
			id: 1719,
			slug: 'call-of-duty-black-ops-ii',
			name: 'Call of Duty: Black Ops II',
			imagePath: 'e82749/S5b68e9',
			stackLabel: null,
			platforms: ['PS3'],
			trophyCount: { bronze: 77, silver: 11, gold: 2, platinum: 1 },
			numOwners: 1224886,
			numTrophies: 91,
			points: 1965,
		});
	});
	test('should accurately parse properties for games WITHOUT plats', () => {
		expect(games[1]).toMatchObject({
			id: 1961,
			slug: 'call-of-juarez-gunslinger',
			name: 'Call of Juarez: Gunslinger',
			imagePath: 'a6f110/S656417',
			stackLabel: null,
			platforms: ['PS3'],
			trophyCount: { bronze: 13, silver: 4, gold: 0, platinum: 0 },
			numOwners: 68811,
			numTrophies: 17,
			points: 315,
		});
	});
});

describe('Parsing from STACK PANEL', () => {
	let games: GameStackEntry[];

	beforeEach(() => {
		const parser = new GameStackEntryParser();
		const nodes = [...document.querySelectorAll<HTMLTableRowElement>('[data-page="trophy_list"] tr')];
		games = nodes.map(node => parser.parse(node));
	});

	test('should ensure games have all expected properties', () => {
		expect(games.every(game => isGameStackEntry(game))).toBe(true);
	});
	test('should accurately parse properties', () => {
		expect(games).toMatchObject([
			{
				id: 9930,
				slug: 'star-wars-jedi-fallen-order',
				name: 'Star Wars Jedi: Fallen Order',
				imagePath: '673a4c/Sc4da58',
				stackLabel: 'EU',
				platforms: ['PS4'],
			},
			{
				id: 13143,
				slug: 'star-wars-jedi-fallen-order',
				name: 'Star Wars Jedi: Fallen Order',
				imagePath: '85aa0d/Sb486c3',
				stackLabel: null,
				platforms: ['PS5'],
			},
		]);
	});
});

describe('Parsing from PROFILE pages', () => {
	let games: PlayableGame[];

	beforeEach(() => {
		const parser = new PlayableGameParser();
		const nodes = [...document.querySelectorAll<HTMLTableRowElement>(`[data-page="profile"] ${Select.TR}`)];
		games = nodes.map(node => parser.parse(node));
	});

	test('should ensure games have all expected properties', () => {
		expect(games.every(game => isPlayableGame(game))).toBe(true);
	});
	test('should accurately parse properties', () => {
		const hasPlatNoDlcNoneEarned = games[0];
		const hasPlatNoDlcSomeEarned = games[1];
		const hasPlatNoDlcAllEarned = games[2]!;

		const hasPlatAndDlcNoneEarned = games[3];
		const hasPlatAndDlcSomeEarned = games[4];
		const hasPlatAndDlcPlatEarned = games[5]!;
		const hasPlatAndDlcAllEarned = games[6]!;

		const noPlatNoneEarned = games[7];
		const noPlatSomeEarned = games[8];
		const noPlatAllEarned = games[9]!;

		expect(hasPlatNoDlcNoneEarned).toEqual({
			id: 22025,
			slug: 'trackmania',
			name: 'Trackmania',
			imagePath: '2e454c/S90418d',
			stackLabel: null,
			trophyCount: { bronze: 0, silver: 0, gold: 0, platinum: 0 },
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
			id: 14617,
			slug: 'battlefield-2042',
			name: 'Battlefield 2042',
			imagePath: 'd9f335/Sc06abf',
			stackLabel: 'NA',
			trophyCount: { bronze: 7, silver: 4, gold: 2, platinum: 0 },
			numTrophies: 13,
			points: 405,
			platforms: ['PS4'],
			rarityBase: 3.78,
			rarityDlc: undefined,
			percent: 42,
			completionStatus: undefined,
			completionSpeed: undefined,
			completionRank: 'A',
			latestTrophy: 1684800000000,
		});
		expect(hasPlatNoDlcAllEarned).toEqual({
			id: 1856,
			slug: 'tomb-raider',
			name: 'Tomb Raider',
			imagePath: 'e74fa4/S43dc8e',
			stackLabel: null,
			trophyCount: { bronze: 41, silver: 7, gold: 2, platinum: 1 },
			numTrophies: 51,
			points: 1305,
			platforms: ['PS3'],
			rarityBase: 4.85,
			rarityDlc: undefined,
			percent: 100,
			completionStatus: 'platinum',
			completionSpeed: 149783040000,
			completionRank: 'S',
			latestTrophy: 1682121600000,
		});
		expect(msToSpeedString(hasPlatNoDlcAllEarned.completionSpeed!)).toBe('4 years, 9 months');

		expect(hasPlatAndDlcNoneEarned).toEqual({
			id: 2783,
			slug: 'velocity-2x',
			name: 'Velocity 2X',
			imagePath: '96db96/Sc1e63c',
			stackLabel: null,
			trophyCount: { bronze: 0, silver: 0, gold: 0, platinum: 0 },
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
			id: 462,
			slug: 'dead-nation',
			name: 'Dead Nation',
			imagePath: 'b62eda/S06ebd3',
			stackLabel: null,
			trophyCount: { bronze: 3, silver: 0, gold: 0, platinum: 0 },
			numTrophies: 3,
			points: 45,
			platforms: ['PS3'],
			rarityBase: 5.46,
			rarityDlc: 1.22,
			percent: 3,
			completionStatus: undefined,
			completionSpeed: undefined,
			completionRank: 'E',
			latestTrophy: 1307577600000,
		});
		expect(hasPlatAndDlcPlatEarned).toEqual({
			id: 3379,
			slug: 'helldivers',
			name: 'Helldivers',
			imagePath: 'ee82d8/S3c029d',
			stackLabel: null,
			trophyCount: { bronze: 14, silver: 18, gold: 5, platinum: 1 },
			numTrophies: 38,
			points: 1500,
			platforms: ['PS3', 'PS4', 'Vita'],
			rarityBase: 1.78,
			rarityDlc: 1.26,
			percent: 96,
			completionStatus: 'platinum',
			completionSpeed: 97234560000,
			completionRank: 'A',
			latestTrophy: 1612742400000,
		});
		expect(msToSpeedString(hasPlatAndDlcPlatEarned.completionSpeed!)).toBe('3 years, 1 month');
		expect(hasPlatAndDlcAllEarned).toEqual({
			id: 2251,
			slug: 'sound-shapes',
			name: 'Sound Shapes',
			imagePath: 'c885c0/Scba921',
			stackLabel: 'NA',
			trophyCount: { bronze: 0, silver: 87, gold: 1, platinum: 1 },
			numTrophies: 89,
			points: 3000,
			platforms: ['PS4'],
			rarityBase: 33.76,
			rarityDlc: 20.28,
			percent: 100,
			completionStatus: 'platinum',
			completionSpeed: 31311360000,
			completionRank: 'S',
			latestTrophy: 1470182400000,
		});
		expect(msToSpeedString(hasPlatAndDlcAllEarned.completionSpeed!)).toBe('11 months, 4 weeks');

		expect(noPlatNoneEarned).toEqual({
			id: 4046,
			slug: 'gems-of-war',
			name: 'Gems of War',
			imagePath: '33a7c0/S1c320e',
			stackLabel: null,
			trophyCount: { bronze: 0, silver: 0, gold: 0, platinum: 0 },
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
			id: 9668,
			slug: 'dead-by-daylight-additional-chapters',
			name: 'Dead by Daylight • Additional Chapters',
			imagePath: '4e6996/S3f3b32',
			stackLabel: null,
			trophyCount: { bronze: 0, silver: 5, gold: 0, platinum: 0 },
			numTrophies: 5,
			points: 150,
			platforms: ['PS4'],
			rarityBase: 0.14,
			rarityDlc: undefined,
			percent: 8,
			completionStatus: undefined,
			completionSpeed: undefined,
			completionRank: 'B',
			latestTrophy: 1656115200000,
		});
		expect(noPlatAllEarned).toEqual({
			id: 2252,
			slug: 'flower',
			name: 'Flower',
			imagePath: 'fb5f19/Sd87cf2',
			stackLabel: null,
			trophyCount: { bronze: 11, silver: 2, gold: 1, platinum: 0 },
			numTrophies: 14,
			points: 315,
			platforms: ['PS4'],
			rarityBase: 8.82,
			rarityDlc: undefined,
			percent: 100,
			completionStatus: 'completed',
			completionSpeed: 62280000,
			completionRank: 'S',
			latestTrophy: 1386115200000,
		});
		expect(msToSpeedString(noPlatAllEarned.completionSpeed!)).toBe('17 hours, 18 minutes');
	});
});

describe('Parsing from SERIES pages', () => {
	let games: PlayableGame[];

	beforeEach(() => {
		const parser = new PlayableGameParser();
		const nodes = [...document.querySelectorAll<HTMLTableRowElement>(`[data-page="series"] ${Select.TR}`)];
		games = nodes.map(node => parser.parse(node));
	});

	test('should ensure games have all expected properties', () => {
		expect(games.every(game => isPlayableGame(game))).toBe(true);
	});

	test('should accurately parse properties', () => {
		expect(games).toEqual([
			{
				id: 1945,
				slug: 'far-cry-3-blood-dragon',
				name: 'Far Cry 3 Blood Dragon',
				imagePath: '3c8202/Sb9b47e',
				stackLabel: null,
				trophyCount: { bronze: 2, silver: 0, gold: 0, platinum: 0 },
				numTrophies: 2,
				points: 30,
				platforms: ['PS3'],
				rarityBase: 22.69,
				rarityDlc: undefined,
				percent: 10,
				completionStatus: undefined,
				completionSpeed: undefined,
				completionRank: undefined,
				latestTrophy: 1407628800000,
			},
			{
				id: 4365,
				slug: 'far-cry-primal',
				name: 'Far Cry Primal',
				imagePath: '224e3f/S9a9e72',
				stackLabel: null,
				trophyCount: { bronze: 38, silver: 10, gold: 2, platinum: 1 },
				numTrophies: 51,
				points: 1350,
				platforms: ['PS4'],
				rarityBase: 26.32,
				rarityDlc: undefined,
				percent: 100,
				completionStatus: 'platinum',
				completionSpeed: 208800000,
				completionRank: undefined,
				latestTrophy: 1470614400000,
			},
			{
				id: 8740,
				slug: 'far-cry-new-dawn',
				name: 'Far Cry: New Dawn',
				imagePath: '33350a/Sf26d5b',
				stackLabel: null,
				trophyCount: { bronze: 38, silver: 10, gold: 2, platinum: 1 },
				numTrophies: 51,
				points: 1350,
				platforms: ['PS4'],
				rarityBase: 27.37,
				rarityDlc: undefined,
				percent: 100,
				completionStatus: 'platinum',
				completionSpeed: 111600000,
				completionRank: undefined,
				latestTrophy: 1550534400000,
			},
			{
				id: 14951,
				slug: 'far-cry-3-blood-dragon-classic-edition',
				name: 'Far Cry 3 Blood Dragon Classic Edition',
				imagePath: '57bbfd/S3d459c',
				stackLabel: null,
				trophyCount: { bronze: 18, silver: 1, gold: 0, platinum: 0 },
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
				id: 2429,
				slug: 'far-cry-classic',
				name: 'Far Cry Classic',
				imagePath: 'ed2a17/Sab551f',
				stackLabel: null,
				trophyCount: { bronze: 5, silver: 9, gold: 7, platinum: 1 },
				numTrophies: 22,
				points: 1275,
				platforms: ['PS3'],
				rarityBase: 30.69,
				rarityDlc: undefined,
				percent: 100,
				completionStatus: 'platinum',
				completionSpeed: 108000000,
				completionRank: undefined,
				latestTrophy: 1434931200000,
			},
		]);
	});
});

describe('Parsing from DLC page', () => {
	let games: GameDlc[];

	beforeEach(() => {
		const parser = new DlcListingParser();
		const nodes = [...document.querySelectorAll<HTMLTableRowElement>('[data-page="dlc"] tr')];
		games = nodes.map(node => parser.parse(node));
	});

	test('should ensure games have all expected properties', () => {
		expect(games.every(game => isGameDlc(game))).toBe(true);
	});
	test('should accurately parse properties', () => {
		expect(games).toEqual([
			{
				id: 22414,
				slug: 'street-fighter-6',
				name: 'Street Fighter 6',
				imagePath: 'f6b6f6/S72a7df',
				dlcName: 'FIGHTING GROUND',
				groupNum: 2,
				platforms: ['PS5'],
				trophyCount: { bronze: 3, silver: 2, gold: 1, platinum: 0 },
				numTrophies: 6,
				points: 195,
			},
			{
				id: 16519,
				slug: 'kao-the-kangaroo',
				name: 'Kao the Kangaroo',
				imagePath: '693320/S82409b',
				dlcName: 'Bend the Rooles',
				groupNum: 1,
				platforms: ['PS4'],
				trophyCount: { bronze: 9, silver: 2, gold: 0, platinum: 0 },
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

		const parser = new GamePageParser();
		const game = parser.parse(jsdom.window.document);
		const trophies = game.trophyGroups.flatMap(group => group.trophies.map(trophy => new PsnpTrophy(trophy)));
		const sampleTrophyElement = trophies[0]!.getElement(jsdom.window.document);

		expect(sampleTrophyElement).not.toBeNull();

		expect(game.id).toBe(2983);
		expect(game.name).toBe('The Evil Within');
		expect(game.slug).toBe('the-evil-within');
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

		expect(game.metadata).toEqual({
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

		const parser = new GamePageParser();
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

		const parser = new GamePageParser();
		const game = parser.parse(jsdom.window.document);

		expect(game.rarityBase).toBe(1.62);
		expect(game.rarityDlc).toBeUndefined();
	});
});
