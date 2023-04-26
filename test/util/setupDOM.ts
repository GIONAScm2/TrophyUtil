import {JSDOM} from 'jsdom';

export function setupDOM(html: string) {
	const {window} = new JSDOM(html);
	(globalThis as any).window = window;
	(globalThis as any).document = window.document;
	(globalThis as any).navigator = {
		userAgent: 'node.js',
	};
}
