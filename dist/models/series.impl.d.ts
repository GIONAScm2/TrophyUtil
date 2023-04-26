import { TrophyCount, PsnpEntity } from './common.js';
import { ISeriesListing } from './series.interface.js';
export declare class PsnpSeriesListing extends PsnpEntity implements ISeriesListing {
    trophyCount: TrophyCount;
    numTrophies: number;
    numGames: number;
    points: number;
    get url(): string;
    get src(): string;
    constructor(data: ISeriesListing);
}
//# sourceMappingURL=series.impl.d.ts.map