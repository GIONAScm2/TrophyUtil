import { IPsnpSeriesPage } from '../../models/series.interface.js';
import { BrowserContext } from '../../util/browserContext.js';
import { PsnpParser } from '../psnpParser.js';
export declare class PsnpSeriesPageParser extends PsnpParser<IPsnpSeriesPage, BrowserContext> {
    protected readonly type = "Series Page";
    protected _parse(page: BrowserContext): IPsnpSeriesPage | null;
}
//# sourceMappingURL=psnpSeriesPageParser.d.ts.map