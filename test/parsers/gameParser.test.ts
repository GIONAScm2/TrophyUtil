import {dirname, resolve} from 'path';
import {fileURLToPath} from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
import fs from 'fs';
import {ParserGameStandard, ParserGamePlayable, ParserGamePartialStack, ParserGamePage} from '../../src/parsers/index';
import {Select} from '../../src/util/index';
import {JSDOM} from 'jsdom';

beforeAll(() => {
	const html = fs.readFileSync(resolve(__dirname, '../fixtures/psnpGameVariety.html'), 'utf8');
	document.body.innerHTML = html;
});

describe('Game Parsers', () => {
	test('should parse trophy_list nodes without error', () => {
		const parser = new ParserGamePartialStack();
		const nodes = [...document.querySelectorAll<HTMLTableRowElement>('[data-page="trophy_list"] tr')];
		expect(() => {
			const games = nodes.map(node => parser.parse(node));
		}).not.toThrow();
	});

	test(`should parse game_home nodes without error`, () => {
		const parser = new ParserGameStandard();
		const nodes = [...document.querySelectorAll<HTMLTableRowElement>('[data-page="game_home"] tr')];
		expect(() => {
			const games = nodes.map(node => parser.parse(node));
		}).not.toThrow();
	});

	test(`should parse game_search nodes without error`, () => {
		const parser = new ParserGameStandard();
		const nodes = [...document.querySelectorAll<HTMLTableRowElement>('[data-page="game_search"] tr')];
		expect(() => {
			const games = nodes.map(node => parser.parse(node));
		}).not.toThrow();
	});

	test(`should parse profile nodes without error`, () => {
		const parser = new ParserGamePlayable();

		const nodes = [...document.querySelectorAll<HTMLTableRowElement>(`[data-page="profile"] ${Select.TR}`)];
		expect(() => {
			const games = nodes.map(node => parser.parse(node));
		}).not.toThrow();
	});

	test(`should parse series game nodes without error`, () => {
		const parser = new ParserGamePlayable();

		const nodes = [...document.querySelectorAll<HTMLTableRowElement>(`[data-page="series"] ${Select.TR}`)];
		expect(() => {
			const games = nodes.map(node => parser.parse(node));
		}).not.toThrow();
	});

	test(`should parse game details from trophy list without error`, () => {
		const html = fs.readFileSync(resolve(__dirname, '../fixtures/psnpTrophyListTEW.html'), 'utf8');
		const jsdom = new JSDOM(html);

		const parser = new ParserGamePage();
		const game = parser.parse(jsdom.window.document);

		expect(game._id).toBe(2983);
		expect(game.name).toBe('The Evil Within');
		expect(game._nameSerialized).toBe('the-evil-within');
		expect(game.forumId).toBe(2725);
		expect(game.platforms.length).toBe(1);
		expect(game.stackLabel).toBeNull();
		expect(game.stacks.length).toBe(6);
		expect(game.trophies.length).toBe(4);

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
});
