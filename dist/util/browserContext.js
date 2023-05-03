export class BrowserContext {
    window;
    url;
    constructor(opts) {
        this.window = opts.window;
        this.url = new this.window.URL(opts.urlOverride ?? opts.window.location.href);
    }
    get doc() {
        return this.window.document;
    }
}
//# sourceMappingURL=browserContext.js.map