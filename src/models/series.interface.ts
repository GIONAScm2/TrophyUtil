import {IPsnpEntity, MongoTimestamps, ITrophyCount} from './common.js';
import {IGamePlayable} from './game.interface.js';

interface AggregatedMetrics {
	numTrophies: number;
	numGames: number;
	points: number;
}
/** Series listing */
export interface ISeriesListing extends IPsnpEntity, ITrophyCount, AggregatedMetrics {}

interface Stages {
	/** PSNP series are broken down into 'stages', with each numbered stage representing a single game (but multiple stacks).
	 * Unnumbered stages ("No stage") can contain multiple games *and* their stacks. */
	stages: Stage[];
}
export interface Stage {
	/** PSNP numbers stages (typically based on chronology) using integers starting at `1`.
	 *
	 * Many series have a "No stage" stage for spinoffs that precedes Stage 1. These stages should be assigned `0`. */
	stageNum: number;
	/** Array of PSNP Game IDs. */
	games: IGamePlayable[];
}

/** Parsed, neutral series page */
export interface ISeriesPageNeutral extends IPsnpEntity, ITrophyCount, AggregatedMetrics, Stages {}
/** Parsed series page specific to a user's progress. */
export interface ISeriesPagePersonal extends IPsnpEntity, Stages, Partial<AggregatedMetrics> {}

/** Series document containing all fields that should be stored. */
export interface ISeriesDoc extends ISeriesPageNeutral, MongoTimestamps {}
