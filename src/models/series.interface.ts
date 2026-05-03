import type { TrophyCountFields } from './common.js';
import type { PsnpEntityData } from './psnpEntity.js';
import type { PlayableGame } from './game.interface.js';

interface SeriesBase extends PsnpEntityData {
	numGames: number;
}

export interface SeriesListing extends SeriesBase, TrophyCountFields {}

interface Stages {
	stages: Stage[];
}

export interface Stage {
	/** PSNProfiles uses `NO` for unnumbered stages; TrophyUtil normalizes that to `0`. */
	stageNum: number;
	gameIds: number[];
	games?: PlayableGame[] | undefined;
}

export interface SeriesPage extends SeriesListing, Stages {}
export interface PersonalSeriesPage extends SeriesBase, Stages, Partial<TrophyCountFields> {}
