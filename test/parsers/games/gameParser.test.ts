import {dirname, resolve} from 'path';
import {fileURLToPath} from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
import fs from 'fs';
import {ParserGameFromTrophyList, sharedPropsAreEqual} from '../../../src/index';

beforeAll(() => {
	const html = fs.readFileSync(resolve(__dirname, '../../fixtures/psnpGameVariety.html'), 'utf8');
	document.body.innerHTML = html;
});

describe('Parse trophy_list game nodes', () => {
	test('Length of parsed games array should be 2', () => {
		const parser = new ParserGameFromTrophyList();
		const nodes = [...document.querySelectorAll<HTMLTableRowElement>('[data-page="trophy_list"] tr')];
		const games = nodes.map(node => parser.parse(node));
		const expected = {
			_id: 9930,
			_nameSerialized: 'star-wars-jedi-fallen-order',
			name: 'Star Wars Jedi: Fallen Order',
			_imagePath: '673a4c/Sc4da58',
			stackLabel: 'EU',
			platforms: ['PS4'],
		};
		expect(sharedPropsAreEqual(games[0] as any, expected)).toBe(true);
	});
});
