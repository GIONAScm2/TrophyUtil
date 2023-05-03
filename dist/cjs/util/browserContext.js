"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserContext = void 0;
class BrowserContext {
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
exports.BrowserContext = BrowserContext;
//# sourceMappingURL=browserContext.js.map