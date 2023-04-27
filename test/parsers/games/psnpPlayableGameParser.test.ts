import {dirname, resolve} from 'path';
import {fileURLToPath} from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
import fs from 'fs';
import {setupDOM} from '../../util/setupDOM';
import { PsnpGameBase, PsnpPageType, ParserGamePlayable} from '../../../src/index';

beforeAll(() => {
	const html = fs.readFileSync(resolve(__dirname, '../../fixtures/psnpProfile.html'), 'utf8');
	setupDOM(html);
});

test('Length of parsed games array should be 100', () => {
	const parser = new ParserGamePlayable();
	const gameNodes = PsnpGameBase.getGameNodes(PsnpPageType.Profile, globalThis.window.document);
	// const gameNodes = globalThis.window.document.querySelectorAll(`#gamesTable:not([style="display: none;"]) tbody > tr:not(:empty, [id*='load'])`)
	const games = gameNodes.map(node => parser.parse(node));

	expect(games.length).toBe(100);
});
