import {dirname, resolve} from 'path';
import {fileURLToPath} from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
import fs from 'fs';
import {ParserSeriesListing, ParserSeriesPageNeutral} from '../../src/parsers/index';
import {PsnpGameBase} from '../../src/models/game.impl';
import {PsnpPageType} from '../../src/pages/pageTypePSNP';
import {JSDOM} from 'jsdom';

describe('Series Parsers', () => {
	test('should parse series listing nodes without error', () => {
		const html = fs.readFileSync(resolve(__dirname, '../fixtures/psnpSeriesCatalog.html'), 'utf8');
		const jsdom = new JSDOM(html);

		const parser = new ParserSeriesListing();
		const nodes = PsnpGameBase.getGameNodes(PsnpPageType.SeriesCatalog, jsdom.window.document);
		expect(() => {
			const seriesListings = nodes.map(node => parser.parse(node));
		}).not.toThrow();
	});

	test('should parse series page without error', () => {
		const html = fs.readFileSync(resolve(__dirname, '../fixtures/psnpSeriesPage.html'), 'utf8');
		const jsdom = new JSDOM(html, {url: `https://psnprofiles.com/series/9-far-cry`});

		const parser = new ParserSeriesPageNeutral();
		expect(() => {
			const seriesListings = parser.parse(jsdom.window);
		}).not.toThrow();
	});
});
