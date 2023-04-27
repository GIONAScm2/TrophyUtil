import {dirname, resolve} from 'path';
import {fileURLToPath} from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
import fs from 'fs';
import {PsnpGameBase, PsnpPageType, ParserGamePlayable} from '../../../src/index';

describe('ParserGamePlayable tests', () => {
	beforeEach(() => {
		const html = fs.readFileSync(resolve(__dirname, '../../fixtures/psnpProfile.html'), 'utf8');
		document.body.innerHTML = html;
	});

	test('Length of parsed games array should be 100', () => {
		const parser = new ParserGamePlayable();
		const gameNodes = PsnpGameBase.getGameNodes(PsnpPageType.Profile, document);
		const games = gameNodes.map(node => parser.parse(node));

		expect(games.length).toBe(100);
	});
});
