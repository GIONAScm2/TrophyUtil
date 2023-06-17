import type { IMongoTimestamps, ITrophyCount } from './common.js';
import type { IPsnpEntity } from './psnpEntity.js';
import type { IGamePlayable } from './game.interface.js';
interface ISeriesBase extends IPsnpEntity {
    numGames: number;
}
/** Series listing */
export interface ISeriesListing extends ISeriesBase, ITrophyCount {
}
/** `stages` */
interface IStages {
    /** PSNP series are broken down into 'stages', with each numbered stage representing a single game (but multiple stacks).
     * Unnumbered stages ("No stage") can contain multiple games *and* their stacks. */
    stages: IStage[];
}
/** `stageNum`, `games`. */
export interface IStage {
    /** PSNP numbers stages (typically based on chronology) using integers starting at `1`.
     *
     * Many series have a "No stage" stage for spinoffs that precedes Stage 1. These stages should be assigned `0`. */
    stageNum: number;
    /** Array of PSNP Game IDs. */
    gameIds: number[];
    games?: IGamePlayable[] | undefined;
}
/** Parsed, neutral series page */
export interface ISeriesPageNeutral extends ISeriesListing, IStages {
}
/** Parsed series page specific to a user's progress. */
export interface ISeriesPagePersonal extends ISeriesBase, IStages, Partial<ITrophyCount> {
}
/** Series document containing all fields that should be stored. */
export interface ISeriesDoc extends ISeriesPageNeutral, Partial<IMongoTimestamps> {
}
export {};
//# sourceMappingURL=series.interface.d.ts.map