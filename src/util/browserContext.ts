export interface WindowLike {
	URL: typeof URL;
	location: Location;
	document: Document;
}

export class BrowserContext {
	readonly window: WindowLike;
	readonly url: URL;

	constructor(opts: {window: WindowLike; urlOverride?: string}) {
		this.window = opts.window;
		this.url = new this.window.URL(opts.urlOverride ?? opts.window.location.href);
		
	}

	get doc() {
		return this.window.document;
	}
}
