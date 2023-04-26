export interface WindowLike {
    URL: typeof URL;
    location: Location;
    document: Document;
}
export declare class BrowserContext {
    readonly window: WindowLike;
    readonly url: URL;
    constructor(opts: {
        window: WindowLike;
        urlOverride?: string;
    });
    get doc(): Document;
}
//# sourceMappingURL=browserContext.d.ts.map