import { PsnpEntity } from './psnpEntity.js';
import { MongoDateField, TrophyCount } from './common.js';
import { ISeriesDoc, ISeriesListing, IStage } from './series.interface.js';
export declare class PsnpSeriesListing extends PsnpEntity implements ISeriesListing {
    trophyCount: TrophyCount;
    numTrophies: number;
    numGames: number;
    points: number;
    get url(): string;
    get src(): string;
    constructor(data: ISeriesListing);
}
export declare class SeriesDoc extends PsnpSeriesListing implements ISeriesDoc {
    stages: IStage[];
    createdAt?: MongoDateField | undefined;
    updatedAt?: MongoDateField | undefined;
    /** Flattens `stages` series stages, returning a 2D array of all games. */
    get allGames(): import("./game.interface.js").IGamePlayable[];
    constructor(data: ISeriesDoc);
}
//# sourceMappingURL=series.impl.d.ts.map