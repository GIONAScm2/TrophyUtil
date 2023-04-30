import {dirname, resolve} from 'path';
import {fileURLToPath} from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
import fs from 'fs';
import {ParserGameFromTrophyList, ParserGameStandard, ParserGamePlayable} from '../../../src/parsers/index';
import {Select} from '../../../src/util/index';

beforeAll(() => {
	const html = fs.readFileSync(resolve(__dirname, '../../fixtures/psnpGameVariety.html'), 'utf8');
	document.body.innerHTML = html;
});

describe('Game Parsers', () => {
	test('should parse trophy_list nodes without error', () => {
		const parser = new ParserGameFromTrophyList();
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
});
