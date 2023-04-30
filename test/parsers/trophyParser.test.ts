import {dirname, resolve} from 'path';
import {fileURLToPath} from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
import fs from 'fs';
import {ParserTrophy, ParserTrophyGroups} from '../../src/parsers/index';
import {Select} from '../../src/util/index';
import {JSDOM} from 'jsdom';

describe('Trophy Parsers', () => {
	test('should parse trophy group nodes from non-DLC list without error', () => {
		const html = fs.readFileSync(resolve(__dirname, '../fixtures/psnpTrophyListNoDlc.html'), 'utf8'); // RE4
		const jsdom = new JSDOM(html);

		const parser = new ParserTrophyGroups();
		const trophyGroups = parser.parse(jsdom.window.document);

		expect(trophyGroups.length).toBe(1);
		expect(trophyGroups[0].name).toBe('Base Game');
		expect(trophyGroups[0].trophies.length).toBe(40);
	});

	test('should parse trophy group nodes from DLC list without error', () => {
		const html = fs.readFileSync(resolve(__dirname, '../fixtures/psnpTrophyListDlc.html'), 'utf8'); // Horizon Zero Dawn
		const jsdom = new JSDOM(html);

		const parser = new ParserTrophyGroups();
		const trophyGroups = parser.parse(jsdom.window.document);

		expect(trophyGroups.length).toBeGreaterThan(1);
		expect(trophyGroups[0].name).toBe('Base Game');
	});
});
