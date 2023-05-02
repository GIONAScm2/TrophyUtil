import {IPsnpEntity, ITrophyCount, IMongoTimestamps, MakePropertiesOptional} from '../index.js';
import {ITrophyGroup} from './trophy.interface.js';

/** Maps {@link StackAbbr} to non-abbreviated name. */
export const StackLookup = {
	NA: 'North American',
	EU: 'European',
	WW: 'Worldwide',
	AS: 'Asian',
	JP: 'Japanese',
	CN: 'Chinese',
	KR: 'Korean',
	GER: 'German',
	AU: 'Australian',
	RU: 'Russian',
	WE: 'Western',
	UK: 'United Kingdom',
	FR: 'French',
	ES: 'Spanish',
	// Non-regions:
	DG: 'Digital',
	PH: 'Physical',
	RR: 'Rereleased',
	OR: 'Original',
} as const;
export type StackAbbr = keyof typeof StackLookup;
export type StackAbbrNullable = StackAbbr | null;
export type Stack = Record<StackAbbr, string>;

export type PlatformTag = 'Vita' | 'VR' | 'PS3' | 'PS4' | 'PS5';

/** `rarityBase` and optionally `rarityDlc` */
interface Rarity {
	/** Number (float) of the first displayed rarity; de facto 'platinum rarity'. */
	rarityBase: number;
	/** Number (float) of the second displayed rarity; de facto 'DLC rarity'. `undefined` if no DLC rarity is present. */
	rarityDlc?: number;
}

export interface IMetadataFields {
	developer?: string;
	publisher?: string;
	genres?: string[];
	themes?: string[];
	modes?: string[];
	otherNames?: string[];
}
interface IMetadata {
	metaData: IMetadataFields;
}

/** Represents a game's header stats. */
export interface IHeaderStats {
	/** Number of game owners. */
	gameOwners: number;
	/** Number of recent players. */
	recentPlayers: number;
	/** Number of tracked users that platted the game, or `undefined` if game is a nonplat. */
	numPlatted?: number;
	/** Average completion percentage. */
	avgCompletion: number;
	/** Total number of trophies tracked users have earned across the site. */
	trophiesEarned: number;
	/** Number of tracked users that have 100%'d the game. For games without DLC, this is equivalent to {@link numPlatted}. */
	num100Percented: number;
}

/** Properties exclusive to games that display user progress. */
interface IGameProgress {
	/** Completion % (integer). Unplayed games don't have a progress bar, so they'll be marked `null`. */
	percent: number | null;
	/** Type of game completion based on game's `class` attribute.
	 *
	 * If a game is platted, it will have the `platinum` class regardless of whether there's DLC.
	 * If a game is a 100%'d nonplat, it will have the `completed` class. */
	completionStatus?: 'platinum' | 'completed';
	/** Completion speed in seconds, or `undefined` if game is incomplete.
	 *
	 * Note that 'platinum in [SPEED 1]' changes to 'completed in [SPEED 2]' if a game has
	 * DLC trophies that the user completes. */
	completionSpeed?: number;
	/** Timestamp at which the most recent trophy was earned (ms). `undefined` for games at 0% (or unplayed series games). */
	latestTrophy?: number;
}

/** Properties universal to all game types. */
export interface IGameBase extends IPsnpEntity {
	/** Array of all PSNP platform tags. */
	platforms: PlatformTag[];
}

interface IStackLabel {
	/** PSNP's abbreviated stack label (`StackAbbr`), or `null` if no label is present.
	 *
	 * **Note:** Stored games may ocasionally have a value of `WW` even if no stack label is present.
	 * This indicates a correction, and should be respected. */
	stackLabel: StackAbbrNullable;
}

/** Only unplayed games have these properties. */
interface IUnplayed {
	/** Number of game owners. */
	numOwners: number;
	/** Number of trophies the game has. */
	numTrophies: number;
	/** Number of points the game is worth. */
	points: number;
}

/** Games from Home page. */
export interface IGamePartialHome extends IGameBase, ITrophyCount {
	/** Number of points the game is worth. */
	points: number;
}
/** Games from TrophyList pages ("Other Platforms and Regions"). */
export interface IGamePartialTrophyList extends IGameBase, IStackLabel {}

/** Games from Games and GameSearch pages. */
export interface IGameStandard extends IGameBase, IStackLabel, ITrophyCount, IUnplayed {}

/** Games from Profile and Series pages. */
export interface IGamePlayable extends IGameBase, IStackLabel, Partial<ITrophyCount>, Rarity, IGameProgress {}

/** Game details retrieved from its trophy list. */
export interface IGamePage extends MakePropertiesOptional<IGameBase, '_imagePath'>, IStackLabel, IMetadata, Rarity {
	/** ID that uniquely identifies the game's PSNP subforum. */
	forumId: number;
	/** List of {@link ITrophyGroup} */
	trophyGroups: ITrophyGroup[];
	/** List of {@link IGamePartialTrophyList} */
	stacks: IGamePartialTrophyList[];
	/** Aggregate stats; see {@link IHeaderStats} */
	completionStats: IHeaderStats;
}

/** Represents a neutral Game document containing all fields that should be stored. */
export interface IGameStandardDoc extends IGameStandard, Rarity, Partial<IMetadata>, IMongoTimestamps {
	/** List of {@link ITrophyGroup} */
	trophyGroups: ITrophyGroup[];
}

/** Represents a user Game document containing all fields that should be stored. */
export interface IGamePlayableDoc extends IGamePlayable, Partial<IUnplayed>, IMongoTimestamps {}
