import { ISeriesPageNeutral } from '../../models/series.interface.js';
import { WindowLike } from '../../util/browserContext.js';
import { PsnpParser } from '../psnpParser.js';
export declare class ParserSeriesPageNeutral extends PsnpParser<ISeriesPageNeutral, WindowLike> {
    protected readonly type = "Series Page";
    protected _parse(_window: WindowLike): ISeriesPageNeutral | null;
}
//# sourceMappingURL=seriesPageNeutral.d.ts.map